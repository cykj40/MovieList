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
    getGenres: async () => {
        return await API.fetch(`genres`);
    },
    getMovieById: async (id) => {
        return await API.fetch(`movies/${id}`);
    },
    searchMovies: async (q, order, genre) => {
        return await API.fetch(`movies/search`, { q, order, genre });
    },
    register: async (name, email, password) => {
        return await API.send("account/register", { name, email, password });
    },
    login: async (email, password) => {
        return await API.send("account/authenticate", { email, password });
    },
    send: async (ServiceName, data) => {
        try {
            const response = await fetch(API.baseURL + serviceName, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    fetch: async (ServiceName, args) => {
        try {
            // Filter out undefined, null, and empty string values
            const cleanArgs = {};
            if (args) {
                Object.keys(args).forEach(key => {
                    const value = args[key];
                    if (value !== undefined && value !== null && value !== "") {
                        cleanArgs[key] = value;
                    }
                });
            }
            const queryString = Object.keys(cleanArgs).length > 0 ? new URLSearchParams(cleanArgs).toString() : "";
            const response = await fetch(API.baseUrl + ServiceName + "?" + queryString);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}