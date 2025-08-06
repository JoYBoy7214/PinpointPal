package controllers

import (
	db "backend/db"
	schema "backend/schema"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
)

var friendsCollection = db.GetFriendsCollection()
var usersCollection = db.GetSignUpCollection()

func GetFriends(c *gin.Context) {
	var friends []schema.Friends

	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "userId not found"})
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userId.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId format"})
		return
	}
	filter := bson.M{
		"status": "accepted",
		"$or": []bson.M{
			{"requester_id": userObjID},
			{"recipient_id": userObjID},
		},
	}
	cursor, err := friendsCollection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't fetch user's friends"})
		return
	}
	if err := cursor.All(context.TODO(), &friends); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode friends"})
		return
	}
	friendIDs := make([]primitive.ObjectID, 0)
	for _, f := range friends {
		if f.Requester_Id == userObjID {
			friendIDs = append(friendIDs, f.Recipient_Id)
		} else {
			friendIDs = append(friendIDs, f.Requester_Id)
		}
	}
	var friendUsers []schema.User
	userFilter := bson.M{"_id": bson.M{"$in": friendIDs}}
	userCursor, err := usersCollection.Find(context.TODO(), userFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't fetch user details"})
		return
	}
	if err := userCursor.All(context.TODO(), &friendUsers); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode user details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "friends retrieved",
		"friends": friendUsers,
	})
}
func AddFriends(c *gin.Context) {
	var friend schema.Friends

	if err := c.ShouldBindJSON(&friend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "userId not Found"})
		return
	}

	userObjID, err := primitive.ObjectIDFromHex(userId.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Prevent user from adding themselves
	if friend.Recipient_Id == userObjID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot add yourself as a friend"})
		return
	}

	friend.Requester_Id = userObjID
	if friend.Status == "" {
		friend.Status = "accepted"
	}

	result, err := friendsCollection.InsertOne(context.TODO(), friend)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Friend request failed to add"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Friend request sent", "id": result.InsertedID})
}
func GetPeople(c *gin.Context) {
	var users []schema.User
	search := c.Query("type")
	userId, exists := c.Get("userId")
	if search == "" {
		c.JSON(http.StatusOK, gin.H{"msg": "search bar is empty"})
	}
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "userId not found"})
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userId.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId format"})
		return
	}
	filter := bson.M{
		"_id": bson.M{"$ne": userObjID}, // Exclude self
		"name": bson.M{
			"$regex":   search,
			"$options": "i",
		},
	}
	cursor, err := usersCollection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't fetch users"})
		return
	}
	if err := cursor.All(context.TODO(), &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode Users"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"people": users})
}
