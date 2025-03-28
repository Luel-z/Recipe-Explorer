package services

import (
	"os"
	"strconv"
	"fmt"

	"github.com/vonmutinda/chapa"
	"github.com/joho/godotenv"
)

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}

func InitializePayment(amount, currency, email, firstName, lastName, txRef, callbackURL, returnURL string) (string, string, error) {
	
	loadEnv()

	var apiKey = os.Getenv("CHAPA_SECRET_KEY")
	chapaAPI := chapa.New(apiKey)
	amountFloat, err := strconv.ParseFloat(amount, 64)
	
    if err != nil {
        return "","", fmt.Errorf("invalid amount format: %w", err)
    }

	paymentReq := &chapa.ChapaPaymentRequest{
        Amount:         amountFloat,
        Currency:       currency,
        Email:          email,
        FirstName:      firstName,
        LastName:       lastName,
		CallbackURL:    callbackURL,
        TransactionRef: txRef,
    }

    response, err := chapaAPI.PaymentRequest(paymentReq)
    if err != nil {
        return "","", fmt.Errorf("payment request failed: %w", err)
    }

    if response.Status != "success" || response.Data.CheckoutURL == "" {
        return "","", fmt.Errorf("payment failed with status '%s': %s", response.Status, response.Message)
    }

    return response.Data.CheckoutURL, response.Status, nil
}

func VerifyPayment(txRef string) (string, error) {
    var apiKey = os.Getenv("CHAPA_SECRET_KEY")
	chapaAPI := chapa.New(apiKey)
	verification, err := chapaAPI.Verify(txRef)

	if err != nil {
		return "failed", fmt.Errorf("payment verfication failed: %w", err)
	}

	return verification.Status, nil
}