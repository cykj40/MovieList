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
	if err != nil {
		log.Fatalf("Error initializing logger: %v", err)
	}
	return logInstance
}

func main() {
	// initialize logger
	logInstance := initializeLogger()

	// Environment variables (optional .env)
	// Do not fail if .env is missing; rely on environment when running in other contexts
	_ = godotenv.Load()

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

	// initialize account repository
	accountRepo, err := data.NewAccountRepository(db, logInstance)
	if err != nil {
		log.Fatalf("Error initializing account repository: %v", err)
	}

	// initialize movie handler
	movieHandler := handlers.MovieHandler{}
	movieHandler.Storage = movieRepo
	movieHandler.Logger = logInstance
	accountHandler := handlers.NewAccountHandler(accountRepo, logInstance)

	http.HandleFunc("/api/movies/top", movieHandler.GetTopMovies)
	http.HandleFunc("/api/movies/random", movieHandler.GetRandomMovies)
	http.HandleFunc("/api/movies/search", movieHandler.SearchMovies)
	http.HandleFunc("/api/movies/", movieHandler.GetMovie)
	http.HandleFunc("/api/genres", movieHandler.GetGenres)
	http.HandleFunc("/api/account/register", accountHandler.Register)
	http.HandleFunc("/api/account/register/", accountHandler.Register)
	http.HandleFunc("/api/account/authenticate", accountHandler.Authenticate)
	http.HandleFunc("/api/account/authenticate/", accountHandler.Authenticate)

	http.Handle("/api/account/favorites/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.GetFavorites)))

	http.Handle("/api/account/watchlist/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.GetWatchlist)))

	http.Handle("/api/account/save-to-collection/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.SaveToCollection)))

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
