export class YouTubeEmbed extends HTMLElement {
    static get observedAttributes() {
        return ["data-url"];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(prop, oldValue, newValue) {
        if (prop === "data-url") {
            console.log("YouTube URL changed from", oldValue, "to", newValue);
            this.render();
        }
    }

    render() {
        const url = this.dataset.url;
        console.log("YouTube rendering with URL:", url);

        if (!url || url === 'null' || url === 'undefined') {
            this.innerHTML = `<div style="background: #333; padding: 2rem; text-align: center; color: #999; border-radius: 8px;">No trailer available</div>`;
            return;
        }

        // Convert YouTube URL to embed format
        const embedUrl = this.convertToEmbedUrl(url);

        if (embedUrl) {
            this.innerHTML = `
                <iframe 
                    width="100%" 
                    height="315" 
                    src="${embedUrl}" 
                    frameborder="0" 
                    allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style="border-radius: 8px;">
                </iframe>
            `;
        } else {
            this.innerHTML = `<div style="background: #333; padding: 2rem; text-align: center; color: #999; border-radius: 8px;">Invalid trailer URL</div>`;
        }
    }

    convertToEmbedUrl(url) {
        if (!url) return null;

        // Handle different YouTube URL formats
        let videoId = null;

        // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
        if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        }
        // YouTube short URL: https://youtu.be/VIDEO_ID
        else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        // Already an embed URL
        else if (url.includes('youtube.com/embed/')) {
            return url;
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        return null;
    }
}


customElements.define("youtube-embed", YouTubeEmbed);