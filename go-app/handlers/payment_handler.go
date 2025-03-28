package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
    "github.com/google/uuid"

	"food-recipe-auth/services"
	"github.com/joho/godotenv"
)

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}

func PaymentHandler(w http.ResponseWriter, r *http.Request) {
    var return_url = os.Getenv("RETURN_URL")
    
    var hasuraPayload struct {
        Action struct {
            Name string `json:"name"`
        } `json:"action"`
        Input struct {
            Amount    string `json:"amount"`
            Email     string `json:"email"`
            FirstName string `json:"first_name"`
            LastName  string `json:"last_name"`
        } `json:"input"`
    }

    if err := json.NewDecoder(r.Body).Decode(&hasuraPayload); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    input := hasuraPayload.Input
    txRef := fmt.Sprintf("tx-%s-%s", uuid.New().String(), time.Now().Format("20060102150405"))

    paymentURL, status, err := services.InitializePayment(
        input.Amount,
        "ETB",
        input.Email,
        input.FirstName,
        input.LastName,
        txRef,
        return_url,
        return_url,
    )
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    var response map[string]interface{}
    if(status == "success" && paymentURL != ""){ 
        response = map[string]interface{}{
            "payment_url": paymentURL,
            "message":     status,
            "transaction_number": "mitmita"+txRef,
        }
    }else{
        response = map[string]interface{}{
            "payment_url": paymentURL,
            "message": "Payment Initializing Failed",
            "transaction_number": "",
        }
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func VerifyHandler(w http.ResponseWriter, r *http.Request) {
		txRef := r.URL.Query().Get("tx_ref")

		if txRef == "" {
			http.Error(w, "Unverfied tx_ref", http.StatusBadRequest)
			return
		}

		success, err := services.VerifyPayment(txRef)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if success == "success" {
			//update the status in the payment table to paid then the event will trigger calling the go increment total earned 
			fmt.Println("Payment successful for tx_ref:", txRef, " ref_id:", r.URL.Query().Get("ref_id"), " status:", r.URL.Query().Get("status") )
		}
	}