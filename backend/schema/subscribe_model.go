//no use for now

package schema

type Keys struct {
	P256dh string `json:"p256dh" bson:"p256dh"`
	Auth   string `json:"auth" bson:"auth"`
}

type Subscribe struct {
	UserID         string `bson:"userId" json:"userId"`
	Endpoint       string `bson:"endpoint" json:"endpoint"`
	ExpirationTime *int64 `bson:"expirationTime" json:"expirationTime"`
	Keys           Keys   `bson:"keys" json:"keys"`
}
