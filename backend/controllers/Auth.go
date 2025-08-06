package controllers

import (
	db "backend/db"
	schema "backend/schema"
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
)

var SignUpCollection = db.GetSignUpCollection()

func SignUp(c *gin.Context) {
	var User schema.User
	if err := c.ShouldBindJSON(&User); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	filter := bson.M{"email_id": User.Email}
	count, err := SignUpCollection.CountDocuments(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(User.Password), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password Hasing failed"})
		return
	}
	User.Password = string(hashedPassword)
	_, err = SignUpCollection.InsertOne(context.TODO(), User)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB insert failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User created"})
}

func Login(c *gin.Context) {
	var User_login schema.User_login
	if err := c.ShouldBindJSON(&User_login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	var stored_user schema.User
	filter := bson.M{"email_id": User_login.Email}
	err := SignUpCollection.FindOne(context.TODO(), filter).Decode(&stored_user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(stored_user.Password), []byte(User_login.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	claims := jwt.MapClaims{
		"uid": stored_user.ID.Hex(),                  // Store userID as string
		"exp": time.Now().Add(time.Hour * 72).Unix(), // expires in 72 hours
		"iat": time.Now().Unix(),                     // issued at
	}
	jwtSecret := os.Getenv("JWT_SECRET")

	// Create the token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with your secret key
	tokenString, err := token.SignedString(([]byte(jwtSecret)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign token"})
		return
	}

	// Return the token to the client
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   tokenString,
	})
}
