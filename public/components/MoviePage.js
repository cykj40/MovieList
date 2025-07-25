import { API } from "../services/API.js";

export class MoviePage extends HTMLElement {
    movies = null;
    query = null;
    order = null;
    genre = null;

    async render() {
        try {
            // Get query parameters
            const urlParams = new URLSearchParams(window.location.search);
            this.query = urlParams.get("q") || "";
            this.order = urlParams.get("order") || "";
            this.genre = urlParams.get("genre") || "";

            // Fetch movies based on parameters
            if (this.query) {
                this.movies = await API.searchMovies(this.query);
            } else {
                this.movies = await API.getTopMovies();
            }
        } catch {
            return;
        }

        // Create the movies list template
        this.innerHTML = `
            <h1>Movies</h1>
            <div class="movies-grid">
                ${this.movies.map(movie => `
                    <div class="movie-card" onclick="app.Router.go('/movies/${movie.id}')">
                        <img src="${movie.poster_url || '/images/generic_actor.jpg'}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>Score: ${movie.score}/10</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define("movie-page", MoviePage);