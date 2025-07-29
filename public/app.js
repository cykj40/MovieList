import { HomePage } from "./components/HomePage.js";
import { API } from "./services/API.js";
import './components/AnimatedLoading.js';
import { MovieDetailsPage } from "./components/MovieDetailsPage.js";
import MoviesPage from "./components/MoviesPage.js";
import { YouTubeEmbed } from "./components/YouTubeEmbed.js";
import { Router } from "./services/Router.js";

// Define window.app first
window.app = {
    Router,
    API,
    showError: (message = "There was an error.", goToHome = true) => {
        document.getElementById("alert-modal").showModal();
        document.querySelector("#alert-modal p").textContent = message;
        if (goToHome) app.Router.go("/");
    },
    closeError: () => {
        document.getElementById("alert-modal").close()
    },
    search: (event) => {
        event.preventDefault();
        const q = document.querySelector("input[type=search]").value;
        app.Router.go("/movies?q=" + q);
    },
    searchOrderChange: (order) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const genre = urlParams.get("genre") ?? "";
        app.Router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
    },
    searchFilterChange: (genre) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const order = urlParams.get("order") ?? "";
        app.Router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
    },
    saveToCollection: (movieId, collectionType) => {
        // This would normally save to API
        console.log(`Saving movie ${movieId} to ${collectionType}`);
        // For now, just show a confirmation
        app.showError(`Movie added to ${collectionType}!`, false);
    }

};

window.addEventListener("DOMContentLoaded", () => {
    app.Router.init();
});
