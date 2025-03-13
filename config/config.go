package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func InitDB() {
	loadEnv()

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)
	
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	fmt.Println("Database connection initialized")

	
	err = db.Ping()
	if err != nil {
		log.Fatal("Database ping failed:", err)
	}

	fmt.Println("Connected to PostgreSQL successfully!")
}

func FetchUser(email, password string) (string, string, error) {
	if db == nil {
		return "", "", fmt.Errorf("database connection is not initialized")
	}

	var userID, role string

	err := db.QueryRow("SELECT id, role FROM users WHERE email=$1 AND password=$2", email, password).
		Scan(&userID, &role)
	

	if err != nil {
		if err == sql.ErrNoRows {
			return "", "", fmt.Errorf("config.go Response invalid credentials")
		}
		return "", "", fmt.Errorf("query error: %v", err)
	}

	return userID, role, nil
}


func RegisterUser(name, email, password, bio string, profileURL string) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}

	result ,err := db.Exec("INSERT INTO users (username, email, password, bio, profile) VALUES ($1, $2, $3, $4, $5)", name, email, password, bio, profileURL)
	fmt.Println(result)
	if err != nil {
		return fmt.Errorf("query error: %v", err)
	}

	return nil
}