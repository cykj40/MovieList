import { HomePage } from "./components/HomePage.js";
import { API } from "./services/API.js";
import './components/AnimatedLoading.js';
import { MovieDetailsPage } from "./components/MovieDetailsPage.js";
import MoviesPage from "./components/MoviesPage.js";
import { YouTubeEmbed } from "./components/YouTubeEmbed.js";
import { RegisterPage } from "./components/RegisterPage.js";
import { Router } from "./services/Router.js";
import Store from "./services/Store.js";

// Define window.app first
window.app = {
    Router,
    API,
    Store,
    showError: (message = "There was an error.", goToHome = false) => {
        const modal = document.getElementById("alert-modal");
        if (modal) {
            modal.showModal();
            const messageElement = modal.querySelector("p");
            if (messageElement) {
                messageElement.textContent = message;
            }
        } else {
            // Fallback if modal is not ready
            console.log("Alert:", message);
            alert(message);
        }
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
    register: async (event) => {
        event.preventDefault();
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const passwordConfirmation = document.getElementById("register-password-confirmation").value;

        const errors = [];
        if (name.length < 4) errors.push("Name must be at least 4 characters long");
        if (password.length < 8) errors.push("Password must be at least 8 characters long");
        if (email.length < 6) errors.push("Email must be at least 6 characters long");
        if (password !== passwordConfirmation) errors.push("Passwords do not match");

        if (errors.length == 0) {
            const response = await API.register(name, email, password);
            if (response.success) {
                app.Store.jwt = response.jwt;
                app.Router.go("/account/")
            } else {
                app.showError(response.message)
            }

        } else {
            app.showError(errors.join(". "))
        }




    },
    login: async (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const errors = [];
        if (email.length < 6) errors.push("Email must be at least 6 characters long");
        if (password.length < 8) errors.push("Password must be at least 8 characters long");

        if (errors.length == 0) {
            const response = await API.login(email, password);
            if (response.success) {
                app.Store.jwt = response.jwt;
                app.Router.go("/account/")
            } else {
                app.showError(response.message)
            }
        }
    },
    logout: () => {
        app.Store.jwt = null;
        app.Router.go("/");
    },
    api: API,
    saveToCollection: async (movieId, collection) => {
        if (app.Store.jwt) {
            try {
                const response = await API.saveToCollection(movieId, collection);
                if (response.success) {
                    app.showError(`Movie added to ${collection}!`, false);
                    switch (collection) {
                        case "favorite":
                            app.Router.go("/account/favorites");
                            break;
                        case "watchlist":
                            app.Router.go("/account/watchlist");
                            break;
                    }
                } else {
                    app.showError("Failed to save movie to collection");
                }
            } catch (error) {
                console.error(error);
                app.showError("Error saving movie to collection");
            }
        } else {
            app.showError("Please login to save movies");
            app.Router.go("/account/login");
        }
    }

};

window.addEventListener("DOMContentLoaded", () => {
    app.Router.init();
});
