import { API } from "../services/API.js";
import { MovieItemComponent } from "./MovieItem.js";

export class HomePage extends HTMLElement {


    async render() {
        // Show loading animation briefly like in the course example
        const loadingElement = document.querySelector("animated-loading");

        const [topMovies, randomMovies] = await Promise.all([
            API.getTopMovies(),
            API.getRandomMovies(),
            new Promise(resolve => setTimeout(resolve, 1000)) // 1 second to see the animation
        ]);

        // Hide loading animation cleanly
        if (loadingElement) {
            loadingElement.style.display = "none";
        }

        renderMoviesinList(topMovies, this.querySelector("#top-10 ul"));
        renderMoviesinList(randomMovies, this.querySelector("#random ul"));

        function renderMoviesinList(movies, ul) {
            if (ul) {
                ul.innerHTML = "";
                movies.forEach(movie => {
                    const li = document.createElement("li");
                    li.appendChild(new MovieItemComponent(movie));
                    ul.appendChild(li);
                });
            }
        }
    }


    connectedCallback() {
        const template = document.getElementById("template-home");
        const content = template.content.cloneNode(true);
        this.appendChild(content);

        this.render();
    }
}
customElements.define("home-page", HomePage);