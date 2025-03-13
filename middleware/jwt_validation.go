package middleware

import (
	"net/http"
	"time"
	"os"
	"github.com/golang-jwt/jwt/v4"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("jwt")
		if err != nil {
			http.Error(w, "Unauthorized: No token found", http.StatusUnauthorized)
			return
		}

		tokenStr := cookie.Value
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			exp := int64(claims["exp"].(float64))
			if exp < time.Now().Unix() {
				http.Error(w, "Unauthorized: Token expired", http.StatusUnauthorized)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}


func init() {
	loadEnv()
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
}