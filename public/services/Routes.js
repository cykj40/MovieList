import { HomePage } from "../components/HomePage.js";
import { MovieDetailsPage } from "../components/MovieDetailsPage.js";
import { MoviePage } from "../components/MoviePage.js";

// Account pages following the same pattern as MovieDetailsPage
class RegisterPage extends HTMLElement {
    formData = null;

    async render() {
        this.innerHTML = `
            <h1>Create Account</h1>
            <form id="register-form">
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" required>
                </div>
                <div>
                    <label for="confirm-password">Confirm Password:</label>
                    <input type="password" id="confirm-password" required>
                </div>
                <button type="submit">Register</button>
            </form>
        `;

        this.querySelector("#register-form").addEventListener("submit", (event) => {
            event.preventDefault();
            // Handle registration logic here
            console.log("Registration form submitted");
        });
    }

    connectedCallback() {
        this.render();
    }
}

class LoginPage extends HTMLElement {
    formData = null;

    async render() {
        this.innerHTML = `
            <h1>Login</h1>
            <form id="login-form">
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit">Login</button>
            </form>
        `;

        this.querySelector("#login-form").addEventListener("submit", (event) => {
            event.preventDefault();
            // Handle login logic here
            console.log("Login form submitted");
        });
    }

    connectedCallback() {
        this.render();
    }
}

class AccountPage extends HTMLElement {
    user = null;

    async render() {
        try {
            // this.user = await API.getCurrentUser();
            this.user = { name: "John Doe", email: "john@example.com" }; // Placeholder
        } catch {
            return;
        }

        this.innerHTML = `
            <h1>My Account</h1>
            <div class="account-info">
                <h2>Account Information</h2>
                <p><strong>Name:</strong> ${this.user.name}</p>
                <p><strong>Email:</strong> ${this.user.email}</p>
                <button onclick="app.Router.go('/account/favorites')">View Favorites</button>
                <button onclick="app.Router.go('/account/watchlist')">View Watchlist</button>
            </div>
        `;
    }

    connectedCallback() {
        this.render();
    }
}

class FavoritesPage extends HTMLElement {
    favorites = null;

    async render() {
        try {
            // this.favorites = await API.getFavorites();
            this.favorites = []; // Placeholder
        } catch {
            return;
        }

        this.innerHTML = `
            <h1>My Favorites</h1>
            <div class="favorites-list">
                ${this.favorites.length > 0 ?
                this.favorites.map(movie => `
                        <div class="movie-card" onclick="app.Router.go('/movies/${movie.id}')">
                            <img src="${movie.poster_url || '/images/generic_actor.jpg'}" alt="${movie.title}">
                            <h3>${movie.title}</h3>
                        </div>
                    `).join('') :
                '<p>No favorites yet. Add some movies to your favorites!</p>'
            }
            </div>
        `;
    }

    connectedCallback() {
        this.render();
    }
}

class WatchlistPage extends HTMLElement {
    watchlist = null;

    async render() {
        try {
            // this.watchlist = await API.getWatchlist();
            this.watchlist = []; // Placeholder
        } catch {
            return;
        }

        this.innerHTML = `
            <h1>My Watchlist</h1>
            <div class="watchlist-list">
                ${this.watchlist.length > 0 ?
                this.watchlist.map(movie => `
                        <div class="movie-card" onclick="app.Router.go('/movies/${movie.id}')">
                            <img src="${movie.poster_url || '/images/generic_actor.jpg'}" alt="${movie.title}">
                            <h3>${movie.title}</h3>
                        </div>
                    `).join('') :
                '<p>No movies in watchlist yet. Add some movies to watch later!</p>'
            }
            </div>
        `;
    }

    connectedCallback() {
        this.render();
    }
}

const routes = [
    {
        path: "/",
        component: HomePage
    },
    {
        path: "/movies",
        component: MoviePage
    },
    {
        path: /\/movies\/(\d+)/,
        component: MovieDetailsPage
    },
    {
        path: "/account/register",
        component: RegisterPage
    },
    {
        path: "/account/login",
        component: LoginPage
    },
    {
        path: "/account/",
        component: AccountPage
    },
    {
        path: "/account/favorites",
        component: FavoritesPage
    },
    {
        path: "/account/watchlist",
        component: WatchlistPage
    },
]

export { routes };

