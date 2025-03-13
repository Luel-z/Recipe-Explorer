package handlers

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"time"
	"github.com/google/uuid"

	"food-recipe-auth/services"
)

func generateFileName() string {
	return uuid.New().String() + "-" + time.Now().Format("20060102150405") + ".jpg"
}

type UploadImageInput struct {
	File string `json:"file"`
}

type UploadImageResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	URL     string `json:"url"`
}

func UploadHandler(w http.ResponseWriter, r *http.Request) {

	var payload struct {
		Input UploadImageInput `json:"input"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Unable to parse JSON payload", http.StatusBadRequest)
		return
	}

	fileData, err := base64.StdEncoding.DecodeString(payload.Input.File)
	if err != nil {
		http.Error(w, "Unable to decode file data", http.StatusBadRequest)
		return
	}

	url, err := services.UploadToS3(fileData, generateFileName())
	if err != nil {
		http.Error(w, "Unable to upload file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := UploadImageResponse{
		Success: true,
		Message: "File uploaded successfully",
		URL:     url,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}