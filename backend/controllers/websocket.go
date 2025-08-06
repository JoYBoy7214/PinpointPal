package controllers

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	clients = make(map[string]*websocket.Conn)
	mu      sync.Mutex // to prevent concurrent map access
)

type message struct {
	Type   string  `json:"Type"`
	UserId string  `json:"userId"` // recipient ID
	Lat    float64 `json:"lat"`
	Lon    float64 `json:"lon"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WsHandler(c *gin.Context) {
	// Upgrade to WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	// Get current user ID from context
	curr_userIdRaw, exists := c.Get("userId")
	if !exists {
		log.Println("userId not found in context")
		return
	}
	curr_userId, ok := curr_userIdRaw.(string)
	if !ok {
		log.Println("userId is not a string")
		return
	}

	// Register connection
	mu.Lock()
	clients[curr_userId] = conn
	mu.Unlock()
	log.Printf("User %s connected", curr_userId)

	// Read messages in a loop
	for {
		var msg message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading from %s: %v", curr_userId, err)
			break // exit the loop and close the connection
		}

		mu.Lock()
		targetConn, ok := clients[msg.UserId] // recipient
		mu.Unlock()
		if ok {
			if err = targetConn.WriteJSON(msg); err != nil {
				log.Printf("Error sending to %s: %v", msg.UserId, err)
			}
		} else {
			log.Printf("User %s is not connected", msg.UserId)
		}
	}

	// Cleanup after disconnect
	mu.Lock()
	delete(clients, curr_userId)
	mu.Unlock()
	log.Printf("User %s disconnected", curr_userId)
}
