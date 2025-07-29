import { API } from "../services/API.js";
import { MovieItemComponent } from "./MovieItem.js";

export default class MoviesPage extends HTMLElement {
    constructor() {
        super();
        console.log("MoviesPage constructor called!");
    }

    async render(query) {
        console.log("MoviesPage render called with query:", query);

        const urlParams = new URLSearchParams(window.location.search);
        const order = urlParams.get("order") || "";
        const genre = urlParams.get("genre") || "";
        console.log("Search parameters:", { query, order, genre });

        try {
            console.log("About to call API.searchMovies");
            const movies = await API.searchMovies(query, order, genre);
            console.log("API.searchMovies returned:", movies);

            const ulMovies = this.querySelector("ul");
            console.log("Found ul element:", ulMovies);
            ulMovies.innerHTML = "";
            if (movies && movies.length > 0) {
                console.log("Processing", movies.length, "movies");
                movies.forEach(movie => {
                    console.log("Creating MovieItemComponent for:", movie.title);
                    const li = document.createElement("li");
                    li.appendChild(new MovieItemComponent(movie));
                    ulMovies.appendChild(li);
                });
            } else {
                console.log("No movies found, showing no results message");
                ulMovies.innerHTML = "<h3>There are no movies with your search</h3>";
            }
        } catch (error) {
            console.error("Error in render method:", error);
            const ulMovies = this.querySelector("ul");
            if (ulMovies) {
                ulMovies.innerHTML = "<h3>Error loading movies</h3>";
            }
        }

        //await this.loadGenres();

        if (order) this.querySelector("#order").value = order;
        if (genre) this.querySelector("#filter").value = genre;

    }


    connectedCallback() {
        console.log("MoviesPage connectedCallback called");
        const template = document.getElementById("template-movies");
        console.log("Template found:", template);
        if (!template) {
            console.error("template-movies not found!");
            return;
        }
        const content = template.content.cloneNode(true);
        console.log("Template content cloned:", content);
        this.appendChild(content);
        console.log("Template content appended to MoviesPage");

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        console.log("Query parameter:", query);
        if (query) {
            this.querySelector("h2").textContent = `'${query}' movies`;
            console.log("About to call render with query:", query);
            this.render(query);
        } else {
            console.log("No query parameter, showing error");
            app.showError();
        }
    }
}
console.log("About to define movies-page custom element");
customElements.define("movies-page", MoviesPage);
console.log("movies-page custom element defined successfully");