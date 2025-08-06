package controllers

import (
	db "backend/db"
	reminder_model "backend/schema"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
)

var collection = db.GetReminderCollection()

func GetReminders(c *gin.Context) {
	var reminder []reminder_model.Reminder
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
	cursor, err := collection.Find(context.TODO(), bson.M{"user_id": userObjID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't fetch user's reminders"})
		return
	}
	if err := cursor.All(context.TODO(), &reminder); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode reminders"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "reminder sent", "reminder": reminder})

}
func AddReminder(c *gin.Context) {
	var reminder reminder_model.Reminder
	if err := c.ShouldBindJSON(&reminder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input for remainder"})
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
	reminder.UserID = userObjID
	result, err := collection.InsertOne(context.TODO(), reminder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "reminder failed to add"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reminder added", "id": result.InsertedID})
}

func DeleteReminder(c *gin.Context) {
	idParam := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	result, err := collection.DeleteOne(context.TODO(), bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "couldn't delete the reminder"})
		return
	}
	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reminder not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "reminder deleted"})
}
