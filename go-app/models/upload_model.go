package models

type UploadImageInput struct {
	File string `json:"file"`
}

type UploadImageResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	URL     string `json:"url"`
}