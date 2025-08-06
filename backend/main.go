package main

import (
	controllers "backend/controllers"
	middleware "backend/middleware"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000" ||
				origin == "http://10.0.2.2:3000" ||
				origin == "capacitor://localhost"
		},

		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.POST("/api/login", controllers.Login)
	r.POST("/api/signup", controllers.SignUp)
	r.GET("/api/reminder", middleware.AuthmiddleWare(), controllers.GetReminders)
	r.POST("/api/reminder", middleware.AuthmiddleWare(), controllers.AddReminder)
	r.DELETE("/api/reminder/:id", middleware.AuthmiddleWare(), controllers.DeleteReminder)
	r.GET("/api/people", middleware.AuthmiddleWare(), controllers.GetPeople)
	r.GET("/api/friends", middleware.AuthmiddleWare(), controllers.GetFriends)
	r.POST("/api/friends", middleware.AuthmiddleWare(), controllers.AddFriends)
	r.Run(":8080")
	for _, ri := range r.Routes() {
		log.Println("Route:", ri.Method, ri.Path)
	}

}
