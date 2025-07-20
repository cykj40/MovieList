import { API } from "./services/API.js";
import { HomePage } from "./components/HomePage.js";

// HomePage web component is automatically instantiated by the <home-page> tag in HTML

window.app = {
    search: (event) => {
        event.preventDefault();
        const q = document.querySelector("input[type=search]").ariaValueMax;

    },
    api: API
}