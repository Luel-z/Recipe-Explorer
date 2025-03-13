package main

import (
    "net/http"
	"fmt"
	"log"

    "food-recipe-auth/handlers"
	"github.com/rs/cors"
	"food-recipe-auth/config"
)

func main() {
	config.InitDB()

	mux := http.NewServeMux()
	mux.HandleFunc("/login", handlers.LoginHandler)
	mux.HandleFunc("/register", handlers.RegisterHandler)
	mux.HandleFunc("/upload", handlers.UploadHandler)

	handler := cors.Default().Handler(mux)

	fmt.Println("Server running on port 8082...")
	log.Fatal(http.ListenAndServe(":8082", handler))
}
