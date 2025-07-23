import { API } from "../services/API.js";

export class MovieDetailsPage extends HTMLElement {
    id = null;
    movie = null;

    async render() {
        try {
            this.movie = await API.getMovieById(this.id);
        } catch (error) {
            console.error("Error loading movie details:", error);
            alert("Error loading movie details");
            return;
        }

        const template = document.getElementById("template-movie-details");
        const content = template.content.cloneNode(true);
        this.appendChild(content);

        // Populate movie details
        this.querySelector("h2").textContent = this.movie.title;
        this.querySelector("h3").textContent = this.movie.tagline || "";

        // Set poster image
        const posterImg = this.querySelector("header img");
        posterImg.src = this.movie.poster_url || '/images/generic_actor.jpg';
        posterImg.alt = `${this.movie.title} poster`;

        // Set overview
        const overview = this.querySelector("#overview");
        overview.textContent = this.movie.overview || "No overview available.";

        // Set genres (clear first to avoid duplicates)
        const genresList = this.querySelector("#genres");
        genresList.innerHTML = "";
        if (this.movie.genres && this.movie.genres.length > 0) {
            this.movie.genres.forEach(genre => {
                const li = document.createElement("li");
                li.textContent = genre.name;
                genresList.appendChild(li);
            });
        }

        // Set trailer URL
        const youtubeEmbed = this.querySelector("#trailer");
        console.log("Movie:", this.movie.title, "Trailer URL:", this.movie.trailer_url);

        if (this.movie.trailer_url) {
            youtubeEmbed.setAttribute('data-url', this.movie.trailer_url);
            console.log("Set trailer URL:", this.movie.trailer_url);
        } else {
            // Clear any existing trailer URL
            youtubeEmbed.removeAttribute('data-url');
            console.log("No trailer URL for this movie");
        }

        // Set metadata
        const metadata = this.querySelector("#metadata");
        metadata.innerHTML = `
            <dt>Release Year</dt>
            <dd>${this.movie.release_year || 'Unknown'}</dd>
            <dt>Score</dt>
            <dd>${this.movie.score ? this.movie.score.toFixed(1) : 'N/A'}</dd>
            <dt>Popularity</dt>
            <dd>${this.movie.popularity ? this.movie.popularity.toFixed(1) : 'N/A'}</dd>
        `;

        // Set cast
        const ulCast = this.querySelector("#cast");
        ulCast.innerHTML = "";
        this.movie.casting.forEach(actor => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${actor.image_url ?? '/images/generic_actor.jpg'}" alt="Picture of ${actor.last_name}">
                <p>${actor.first_name} ${actor.last_name}</p>
            `;
            ulCast.appendChild(li);
        });
    }

    connectedCallback() {
        // Get movie ID from URL hash or default to 1
        const hash = window.location.hash;
        this.id = hash ? parseInt(hash.replace('#movie/', '')) : 1;
        this.render();
    }
}

customElements.define("movie-details-page", MovieDetailsPage);