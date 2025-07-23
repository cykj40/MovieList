import { HomePage } from "./components/HomePage.js";
import { API } from "./services/API.js";
import './components/AnimatedLoading.js';
import { MovieDetailsPage } from "./components/MovieDetailsPage.js";
import { YouTubeEmbed } from "./components/YouTubeEmbed.js";

// Make sure HomePage is registered
console.log("HomePage class:", HomePage);

console.log("app.js loaded - imports complete");

// Define window.app first
window.app = {
    navigate: () => {
        console.log("Navigating to:", window.location.hash);
        const main = document.querySelector("main");
        const hash = window.location.hash;

        // Clear main content
        main.innerHTML = '';

        if (hash.startsWith('#movie/')) {
            // Show movie details
            const movieId = hash.replace('#movie/', '');
            console.log("Loading movie details page for movie ID:", movieId);
            const movieDetailsPage = new MovieDetailsPage();
            main.appendChild(movieDetailsPage);
        } else {
            // Show home page (default)
            console.log("Loading home page");

            // Add loading animation
            const loadingElement = document.createElement('animated-loading');
            loadingElement.setAttribute('data-elements', '10');
            loadingElement.setAttribute('data-width', '150px');
            loadingElement.setAttribute('data-height', '225px');
            main.appendChild(loadingElement);

            // Add home page component
            const homePageElement = document.createElement('home-page');
            main.appendChild(homePageElement);

            console.log("Home page components added");
        }
    },

    search: (event) => {
        event.preventDefault();
        const q = document.querySelector("input[type=search]").value;
        console.log("Search for:", q);
        // TODO: Implement search functionality
    },

    api: API
};

// Initialize after DOM is loaded
window.addEventListener("DOMContentLoaded", event => {
    console.log("DOM loaded, initializing app");
    window.app.navigate(); // Initialize routing
});

// Add navigation when hash changes
window.addEventListener("hashchange", () => {
    console.log("Hash changed");
    window.app.navigate();
});