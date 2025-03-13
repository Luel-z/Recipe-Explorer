package services

import (
	"os"
	"bytes"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)
var Region = os.Getenv("REGION")
var Bucket = os.Getenv("BUCKET")

func UploadToS3(fileData []byte, fileName string) (string, error) {

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(Region), 
	})
	if err != nil {
		return "", err
	}

	uploader := s3manager.NewUploader(sess)
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(Bucket),
		Key:    aws.String(fileName),
		Body:   bytes.NewReader(fileData),
		ContentType: aws.String("image/jpg"),
		ContentDisposition: aws.String("inline"),
	})
	if err != nil {
		return "", err
	}

	return result.Location, nil
}