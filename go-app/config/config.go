package config

import (
	"context"
	"fmt"
	"github.com/google/uuid"

	"github.com/hasura/go-graphql-client"
)

var (
	gqlClient *graphql.Client
)

func InitializeGraphQLClient(graphqlURL string) {
	gqlClient = graphql.NewClient(graphqlURL, nil)
}

func FetchUser(email, password string) (string, string, error) {
	if gqlClient == nil {
		return "", "", fmt.Errorf("GraphQL client is not initialized")
	}

	var query struct {
		Users [] struct {
			ID   string `graphql:"id"`
			Role string `graphql:"role"`
		} `graphql:"users(where: {email: {_eq: $email}, password: {_eq: $password}})"`
	}
	variables := map[string]interface{}{
		"email":    email,
		"password": password,
	}
	err := gqlClient.Query(context.Background(), &query, variables)
	if err != nil {
		return "", "", fmt.Errorf("GraphQL query error: %v", err)
	}

	if len(query.Users) == 0 {
		return "", "", fmt.Errorf("invalid credentials")
	}

	return query.Users[0].ID, query.Users[0].Role, nil
}

func RegisterUser(name, email, password, bio, profileURL string) error {
	if gqlClient == nil {
		return fmt.Errorf("GraphQL client is not initialized")
	}

	var mutation struct {
		InsertUsersOne struct {
			ID string `graphql:"id"`
		} `graphql:"insert_users_one(object: {username: $username, email: $email, password: $password, bio: $bio, profile: $profile})"`
	}

	variables := map[string]interface{}{
		"username": name,
		"email":    email,
		"password": password,
		"bio":      bio,
		"profile":  profileURL,
	}

	err := gqlClient.Mutate(context.Background(), &mutation, variables)

	if err != nil {
		return fmt.Errorf("GraphQL mutation error: %v", err)
	}

	return nil
}

func IncrementEarnedAmount (amount float64, userID string) (string, error){
	if gqlClient == nil {
		return "",fmt.Errorf("GraphQL client is not initialized")
	}

	var mutation struct {
		UpdateUser struct {
			ID uuid.UUID `graphql:"id"`
		} `graphql:"update_users(where: {id: {_eq: $userID}}, _inc: {total_earned: $amount})"`
	}

	variables := map[string]interface{}{
		"user_id": userID,
		"amount":  amount,
	}

	err := gqlClient.Mutate(context.Background(), &mutation, variables);

	if err != nil {
		return "",fmt.Errorf("Error while incrementing earned value", err)
	}

	return "Successfully updated total_earned", nil
}
