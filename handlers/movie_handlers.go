package handlers

import (
	"encoding/json"
	"net/http"

	"frontendmasters.com/reelingit/models"
)

type MovieHandler struct {
	// todo: fill this with more data
}

func (h *MovieHandler) writeJSONResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (h *MovieHandler) GetTopMovies(w http.ResponseWriter, r *http.Request) {
	movies := []models.Movie{
		{
			ID:          1,
			TMDB_ID:     181,
			Title:       " The Hacker",
			ReleaseYear: 2022,
			Genres:      []models.Genre{{ID: 1, Name: "Thriller"}},
			Keywords:    []string{},
			Casting:     []models.Actor{{ID: 1, FirstName: "Mad", LastName: "Max"}},
		},
		{
			ID:          2,
			TMDB_ID:     181,
			Title:       " The Matrix ",
			ReleaseYear: 1999,
			Genres:      []models.Genre{{ID: 2, Name: "Thriller"}},
			Keywords:    []string{},
			Casting:     []models.Actor{{ID: 1, FirstName: "Keanu", LastName: "Reeves"}},
		},
	}
	h.writeJSONResponse(w, movies)
}

func (h *MovieHandler) GetRandomMovies(w http.ResponseWriter, r *http.Request) {
	movies := []models.Movie{
		{
			ID:          1,
			TMDB_ID:     181,
			Title:       " The Hacker",
			ReleaseYear: 2022,
			Genres:      []models.Genre{{ID: 1, Name: "Thriller"}},
			Keywords:    []string{},
			Casting:     []models.Actor{{ID: 1, FirstName: "Mad", LastName: "Max"}},
		},
		{
			ID:          2,
			TMDB_ID:     181,
			Title:       " The Matrix ",
			ReleaseYear: 1999,
			Genres:      []models.Genre{{ID: 2, Name: "Thriller"}},
			Keywords:    []string{},
			Casting:     []models.Actor{{ID: 1, FirstName: "Keanu", LastName: "Reeves"}},
		},
	}

	h.writeJSONResponse(w, movies)
}
