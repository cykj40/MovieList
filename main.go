package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"frontendmasters.com/reelingit/data"
	"frontendmasters.com/reelingit/handlers"
	"frontendmasters.com/reelingit/logger"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func initializeLogger() *logger.Logger {
	logInstance, err := logger.NewLogger("movie.log")
	logInstance.Error("Hello", nil)
	if err != nil {
		log.Fatalf("Error initializing logger: %v", err)
	}
	defer logInstance.Close()
	return logInstance
}

func main() {
	// initialize logger
	logInstance := initializeLogger()

	// Environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Connect to database

	dbConnStr := os.Getenv("DATABASE_URL")
	if dbConnStr == "" {
		log.Fatalf("DATABASE_URL is not set")
	}

	db, err := sql.Open("postgres", dbConnStr)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	defer db.Close()

	// initialize movie repository
	movieRepo, err := data.NewMovieRepository(db, logInstance)
	if err != nil {
		log.Fatalf("Error initializing movie repository: %v", err)
	}

	// initialize movie handler
	movieHandler := handlers.MovieHandler{}
	movieHandler.Storage = movieRepo
	movieHandler.Logger = logInstance

	http.HandleFunc("/api/movies/top", movieHandler.GetTopMovies)
	http.HandleFunc("/api/movies/random", movieHandler.GetRandomMovies)
	http.HandleFunc("/api/movies/search", movieHandler.SearchMovies)
	http.HandleFunc("/api/movies/", movieHandler.GetMovie)
	http.HandleFunc("/api/genres", movieHandler.GetGenres)

	cathAllClientRoutesHandler := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./public/index.html")
	}

	http.HandleFunc("/movie/", cathAllClientRoutesHandler)
	http.HandleFunc("/movies/", cathAllClientRoutesHandler)
	http.HandleFunc("/account/", cathAllClientRoutesHandler)

	// handler for static files (html, css, js, images)
	http.Handle("/", http.FileServer(http.Dir("public")))

	fmt.Println("Server is running on port 8080")

	const addr = ":8080"
	err = http.ListenAndServe(addr, nil)
	if err != nil {
		logInstance.Error("Error starting server", err)
		log.Fatalf("Error starting server: %v", err)
	}

}
