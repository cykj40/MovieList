import { HomePage } from "../components/HomePage.js";
import { MovieDetailsPage } from "../components/MovieDetailsPage.js";
import MoviesPage from "../components/MoviesPage.js";
import { RegisterPage } from "../components/RegisterPage.js";
import { LoginPage } from "../components/Loginpage.js";

class AccountPage extends HTMLElement {
    user = null;

    async render() {
        try {
            // Check if user is actually logged in
            if (!app.Store.jwt) {
                this.innerHTML = '<h1>Not logged in</h1><p>Please <a href="/account/login">login</a> or <a href="/account/register">register</a></p>';
                return;
            }

            // For now, extract user info from the JWT payload
            // In a real app, you'd call API.getCurrentUser()
            try {
                const payload = JSON.parse(atob(app.Store.jwt.split('.')[1]));
                this.user = {
                    name: payload.name || "User",
                    email: payload.email || "user@example.com"
                };
            } catch (e) {
                // Fallback if JWT parsing fails
                this.user = { name: "User", email: "user@example.com" };
            }
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
                <button onclick="app.logout()" style="background-color: #dc3545;">Logout</button>
            </div>
        `;
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define("account-page", AccountPage);

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
        component: MoviesPage
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
        component: AccountPage,
        loggedIn: true
    },
    {
        path: "/account/favorites",
        component: FavoritesPage,
        loggedIn: true
    },
    {
        path: "/account/watchlist",
        component: WatchlistPage,
        loggedIn: true
    },

]

customElements.define("favorites-page", FavoritesPage);
customElements.define("watchlist-page", WatchlistPage);

export { routes };

