import { routes } from "./Routes.js";

export const Router = {
    init: () => {
        window.addEventListener("popstate", () => {
            Router.go(location.pathname, false);
        });
        // Enhance current links in the document
        document.querySelectorAll("a.navlink").forEach(a => {
            a.addEventListener("click", event => {
                event.preventDefault();
                const href = a.getAttribute("href");
                Router.go(href);
            })
        })

        // Go to the initial route
        Router.go(location.pathname + location.search)
    },
    go: (route, addToHistory = true) => {
        console.log("Router.go called with route:", route);

        if (addToHistory) {
            history.pushState(null, "", route)
        }
        let pageElement = null

        const routePath = route.includes('?') ? route.split("?")[0] : route;
        console.log("Processing route path:", routePath);

        let needsLogin = false;

        for (const r of routes) {
            console.log("Checking route:", r.path);
            if (typeof r.path === "string" && r.path === routePath) {
                // String path
                console.log("String path match found");
                try {
                    pageElement = new r.component();
                    needsLogin = r.loggedIn === true
                } catch (error) {
                    console.error("Error creating component:", error);
                }
                break;
            } else if (r.path instanceof RegExp) {
                // RegEx path
                const match = r.path.exec(routePath);
                console.log("RegExp match result:", match);
                if (match) {
                    console.log("RegExp path match found, params:", match.slice(1));
                    try {
                        pageElement = new r.component();
                        const params = match.slice(1);
                        pageElement.params = params;
                        needsLogin = r.loggedIn === true
                    } catch (error) {
                        console.error("Error creating component:", error);
                    }
                    break;
                }
            }
        }

        if (pageElement == null) {
            console.log("No route match found, showing 404");
            pageElement = document.createElement("h1")
            pageElement.textContent = "Page not found"
        }

        console.log("Updating main element with:", pageElement);
        const mainElement = document.querySelector("main");
        console.log("Main element found:", !!mainElement);
        console.log("Main element current content:", mainElement ? mainElement.innerHTML.substring(0, 100) + "..." : "NO MAIN ELEMENT");

        if (mainElement) {
            mainElement.innerHTML = "";
            mainElement.appendChild(pageElement);
            console.log("Main element updated, new content:", mainElement.innerHTML.substring(0, 100) + "...");
        } else {
            console.error("Could not find main element!");
        }
    }
}