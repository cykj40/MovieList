export class MovieItemComponent extends HTMLElement {
    constructor(movie) {
        super();
        this.movie = movie;
    }

    connectedCallback() {
        // Use a fallback image if poster_url is undefined or null
        const posterUrl = this.movie.poster_url || '/images/generic_actor.jpg';

        this.innerHTML = `
            <a href="/movies/${this.movie.id}">
                <img src="${posterUrl}" alt="${this.movie.title} poster" onerror="this.src='/images/generic_actor.jpg'">
                <p>${this.movie.title} (${this.movie.release_year})</p>
            </a>
        `;

        // Add click handler for router navigation
        this.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Movie clicked, navigating to:", `/movies/${this.movie.id}`);
            console.log("app.Router exists:", !!app.Router);
            console.log("app.Router.go exists:", typeof app.Router.go);
            app.Router.go(`/movies/${this.movie.id}`);
        });
    }


}

customElements.define("movie-item", MovieItemComponent);