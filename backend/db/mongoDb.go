package mongoDb


import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func ConnectDb() *mongo.Client {
	if client != nil {
		return client
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	uri := os.Getenv("MONGODB_SECRET")
	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("MongoDB connection error: %v", err)
	}

	// Optional: ping
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("MongoDB ping error: %v", err)
	}

	return client
}

func GetReminderCollection() *mongo.Collection {
	return ConnectDb().Database("reminderapp").Collection("reminders")
}

func GetSignUpCollection() *mongo.Collection {
	return ConnectDb().Database("remainderapp").Collection("SignUp")
}

func GetFriendsCollection() *mongo.Collection {
	return ConnectDb().Database("reminderapp").Collection("friends")
}
