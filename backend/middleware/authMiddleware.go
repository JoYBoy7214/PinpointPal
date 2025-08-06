package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func AuthmiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No header found"})
			return
		}
		tokenstr := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenstr, func(token *jwt.Token) (interface{}, error) { // we are using interface so the function can return any data type
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || claims["uid"] == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		c.Set("userId", claims["uid"].(string))
		c.Next()
	}
}
