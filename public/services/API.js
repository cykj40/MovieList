export const API = {
    baseUrl: "/api/",
    getTopMovies: async () => {
        const response = await fetch("/api/movies/top");
        const result = await response.json();
        return result;
    },
    getRandomMovies: async () => {
        const response = await fetch("/api/movies/random");
        const result = await response.json();
        return result;
    },
    getMovieById: async (id) => {
        return await API.fetch(`movies/${id}`);
    },
    searchMovies: async (q, order, genre) => {
        return await API.fetch(`movies/search/`, { q, order, genre });
    },
    fetch: async (ServiceName, args) => {
        try {
            const queryString = args ? new URLSearchParams(args).toString() : "";
            const response = await fetch(API.baseUrl + ServiceName + "?" + queryString);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

}