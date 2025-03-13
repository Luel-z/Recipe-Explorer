package middleware

import (
	"log"
	"os"
	"time"
	
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}


var jwtSecret []byte

func GenerateToken(userID, role string) (string, error) {
	claims := jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 24).Unix(),
		"hasura_claims": map[string]interface{}{
			"x-hasura-allowed-roles": []string{role},
			"x-hasura-default-role":  role,
			"x-hasura-user-id":       userID,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func init() {
	loadEnv()
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
}