package main

import (
	"fmt"
	"log"
	"net/http"

	"frontendmasters.com/reelingit/handlers"
	"frontendmasters.com/reelingit/logger"
)

func initializeLogger() *logger.Logger {
	logInstance, err := logger.NewLogger("movie.log")
	if err != nil {
		log.Fatalf("Error initializing logger: %v", err)
	}
	defer logInstance.Close()
	return logInstance
}

func main() {

	logInstance := initializeLogger()

	movieHandler := handlers.MovieHandler{}

	http.HandleFunc("/api/movies/top", movieHandler.GetTopMovies)
	http.HandleFunc("/api/movies/random", movieHandler.GetRandomMovies)

	// handler for static files (html, css, js, images)
	http.Handle("/", http.FileServer(http.Dir("public")))

	fmt.Println("Server is running on port 8080")

	const addr = ":8080"
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		logInstance.Error("Error starting server", err)
		log.Fatalf("Error starting server: %v", err)
	}

}
