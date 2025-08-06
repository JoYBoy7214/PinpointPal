package schema

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Friends struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Requester_Id primitive.ObjectID `bson:"requester_id" json:"requester_id"`
	Recipient_Id primitive.ObjectID `bson:"recipient_id" json:"recipient_id"`
	Status       string             `bson:"status" json:"status"`
}
