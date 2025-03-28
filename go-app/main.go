package main

import (
    "net/http"
	"fmt"
	"log"
	"os"

    "food-recipe-auth/handlers"
	"github.com/rs/cors"
	"food-recipe-auth/config"
	"food-recipe-auth/middleware"
	"github.com/joho/godotenv"
)

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	loadEnv()
	var GraphqlEndpoint = os.Getenv("GRAPHQL_ENDPOINT")
	config.InitializeGraphQLClient(GraphqlEndpoint)

	mux := http.NewServeMux()
    mux.Handle("/login", middleware.ValidateHasuraSecret(
        http.HandlerFunc(handlers.LoginHandler),
    ))
	mux.Handle("/register", middleware.ValidateHasuraSecret(
        http.HandlerFunc(handlers.RegisterHandler),
    ))
	mux.Handle("/upload", middleware.ValidateHasuraSecret(
        http.HandlerFunc(handlers.UploadHandler),
    ))
	mux.Handle("/initiate-payment", middleware.ValidateHasuraSecret(
        http.HandlerFunc(handlers.PaymentHandler),
    ))
	mux.Handle("/verify-payment", middleware.ValidateHasuraSecret(
        http.HandlerFunc(handlers.VerifyHandler),
    ))
	mux.Handle("/incrementearned", middleware.ValidateHasuraSecret(
        http.HandlerFunc(handlers.IncrementEarned),
    ))
	
	handler := cors.Default().Handler(mux)

	fmt.Println("Server running on port 8082...")
	log.Fatal(http.ListenAndServe(":8082", handler))
}
