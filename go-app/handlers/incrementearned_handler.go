package handlers

import (
	"encoding/json"
	"net/http"
	"fmt"
	
	"food-recipe-auth/config"
)

type EventPayload struct {
	Event struct {
		Op string `json:"op"`
		Data struct {
			Old struct {
				Amount float64 `json:"amount"`
				UserID string  `json:"user_id"`
				Status string  `json:"status"`
			} `json:"old"`
			New struct {
				Amount float64 `json:"amount"`
				UserID string  `json:"user_id"`
				Status string  `json:"status"`
			} `json:"new"`
		} `json:"data"`
	} `json:"event"`
	ID string `json:"id"`
}

func IncrementEarned(w http.ResponseWriter, r *http.Request) {
	var payload EventPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	if payload.Event.Data.New.Status == "paid" && payload.Event.Data.Old.Status != "paid"{
		userID := payload.Event.Data.New.UserID
		amount := payload.Event.Data.New.Amount

		message, err := config.IncrementEarnedAmount(amount,userID)
		w.WriteHeader(http.StatusOK)
		if(err == nil){
			w.Write([]byte(message))
			return
		}
		fmt.Println(err)
		w.Write([]byte(`{"message": "failed to updated total_earned"}`))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "failed to updated total_earned"}`))
}