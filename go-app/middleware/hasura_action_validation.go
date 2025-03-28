package middleware

import (
	"encoding/json"
	"net/http"
	"os"
	"food-recipe-auth/models"
)

func writeJSONResponse(w http.ResponseWriter, statusCode int, response models.ActionResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func ValidateHasuraSecret(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		loadEnv()
		var secretKey = os.Getenv("ACTION_SECRET_ENV")
		hasuraKey := r.Header.Get("ACTION_SECRET")
		if (secretKey != hasuraKey) {
			writeJSONResponse(w, http.StatusForbidden, models.ActionResponse{Message:"Forbidden"})
			return
		}
		next.ServeHTTP(w, r)
	})
}
