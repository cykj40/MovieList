export class MovieItemComponent extends HTMLElement {
    constructor(movie) {
        super();
        this.movie = movie;
    }

    connectedCallback() {
        // Use a fallback image if poster_url is undefined or null
        const posterUrl = this.movie.poster_url || '/images/generic_actor.jpg';

        this.innerHTML = `
            <a href="#movie/${this.movie.id}">
            <article>
                <img src="${posterUrl}" alt="${this.movie.title} poster" onerror="this.src='/images/generic_actor.jpg'">
                <p>${this.movie.title} (${this.movie.release_year})</p>
            </article>
            </a>
        `;

        // Add click handler for navigation
        this.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = `movie/${this.movie.id}`;
            window.app.navigate();
        });
    }


}

customElements.define("movie-item", MovieItemComponent);