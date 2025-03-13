package handlers

import (
	"encoding/json"
	"net/http"
	"encoding/base64"

	"food-recipe-auth/config"
	"food-recipe-auth/middleware"
	"food-recipe-auth/models"	
	"food-recipe-auth/services"

)

func writeJSONResponse(w http.ResponseWriter, statusCode int, response models.ActionResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSONResponse(w, http.StatusMethodNotAllowed, models.ActionResponse{Message: "Invalid request method"})
		return
	}

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONResponse(w, http.StatusBadRequest, models.ActionResponse{Message: "Invalid request payload: " + err.Error()})
		return
	}

	userID, role, err := config.FetchUser(req.Input.Email, req.Input.Password)
	if err != nil {
		writeJSONResponse(w, http.StatusUnauthorized, models.ActionResponse{Message: "Invalid credentials"})
		return
	}

	token, err := middleware.GenerateToken(userID, role)
	if err != nil {
		writeJSONResponse(w, http.StatusInternalServerError, models.ActionResponse{Message: "Error generating token"})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    token,
		HttpOnly: false,
		Secure:   false,
		Path:     "/",
	})

	writeJSONResponse(w, http.StatusOK, models.ActionResponse{
		Token:   token,
		UserID:  userID,
		Role:    "authenticated",
		Message: "Login successful",
	})
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSONResponse(w, http.StatusMethodNotAllowed, models.ActionResponse{Message: "Invalid request method"})
		return
	}

	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONResponse(w, http.StatusBadRequest, models.ActionResponse{Message: "Invalid request payload: " + err.Error()})
		return
	}

	userID, role, _ := config.FetchUser(req.RegisterInput.Email, req.RegisterInput.Password)
	if role == "authenticated" || userID != "" {
		writeJSONResponse(w, http.StatusConflict, models.ActionResponse{Message: "User Already Exists"})
		return
	}

	fileData, err := base64.StdEncoding.DecodeString(req.RegisterInput.Profile)
	if err != nil {
		//console.log("Error decoding base64 data: " + err)
		return 
	}

	profileURL, err := services.UploadToS3(fileData, "profile-"+req.RegisterInput.Email+".jpg")
	if err != nil {
		//console.log("Error uploading profile picture:" + err)
		http.Error(w, "Unable to upload profile picture", http.StatusInternalServerError)
		return
	}

	if err := config.RegisterUser(req.RegisterInput.Name, req.RegisterInput.Email, req.RegisterInput.Password, req.RegisterInput.Bio, profileURL); err != nil {
		writeJSONResponse(w, http.StatusInternalServerError, models.ActionResponse{Message: "Error registering user"})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    "",
		HttpOnly: false,
		Secure:   false,
		Path:     "/",
	})

	writeJSONResponse(w, http.StatusOK, models.ActionResponse{
		Token:   "",
		UserID:  "",
		Role:    "",
		Message: "Register successful",
	})
}
