package models

type Actor struct {
	ID        int     `json:"id"`
	FirstName string  `json:"first_name"`
	LastName  string  `json:"last_name"`
	ImageUrl  *string `json:"image_url,omitempty"`
}
