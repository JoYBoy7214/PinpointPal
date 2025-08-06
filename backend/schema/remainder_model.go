package schema

import "go.mongodb.org/mongo-driver/bson/primitive"

type Reminder struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Latitude  float64            `bson:"lat" json:"lat"`
	Longitude float64            `bson:"lon" json:"lon"`
}
