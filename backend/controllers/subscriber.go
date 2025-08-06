// //no use for now

package controllers

// import (
// 	db "backend/db"
// 	subscribe "backend/schema"
// 	"context"
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// )

// var collectionSubscribe = db.GetSubscribeCollection()

// func AddSubscribe(c *gin.Context) {
// 	var subcribe subscribe.Subscribe
// 	if err := c.ShouldBindJSON(&subcribe); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}
// 	_, err := collectionSubscribe.InsertOne(context.TODO(), subcribe)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB insert failed"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "Reminder added"})
// }
