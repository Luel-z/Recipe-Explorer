package models

type Action struct {
	Name string `json:"name"`
}

type Input struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SessionVariables struct {
	Role   string `json:"x-hasura-role"`
	UserID string `json:"x-hasura-user-id"`
}

type RegisterInput struct {
	Name     string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Bio      string `json:"bio"`
	Profile  string `json:"profile"`
}

type LoginRequest struct {
	Action           Action           `json:"action"`
	Input            Input            `json:"input"`
	SessionVariables SessionVariables `json:"session_variables"`
}

type RegisterRequest struct {
	Action           Action           `json:"action"`
	RegisterInput    RegisterInput    `json:"input"`
	SessionVariables SessionVariables `json:"session_variables"`
}

type ActionResponse struct {
	Token   string `json:"token"`
	UserID  string `json:"user_id"`
	Role    string `json:"role"`
	Message string `json:"message"`
}
