let accessToken = '';
const clientID = "4c3e6782558d475da3bda5996575ba4b";
const redirectUrl = "https://kclout-jammming.netlify.app";

function generateRandomString(length = 128) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let str = '';
  
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64 = btoa(String.fromCharCode(...hashArray));

    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const Spotify = {    
    async getAccessToken() {
        if(accessToken) return accessToken;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        const scopes = [
            "playlist-modify-public",
            "playlist-modify-private",
            "ugc-image-upload",
        ]

        if (error) {
            console.error("Error during authentication:", error);
            localStorage.removeItem("code_verifier");
            window.history.replaceState({}, document.title, window.location.pathname);
            return null;
        }

        if(code) {
            const retrievedCodeVerifier = localStorage.getItem("code_verifier");
            localStorage.removeItem("code_verifier");
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: redirectUrl,
                    client_id: clientID,
                    code_verifier: retrievedCodeVerifier,
                })
            });

            if (!response.ok) {
                console.error("Failed to get access token:", response.status, response.statusText);
                return null;
            }

            const jsonResponse = await response.json();
            accessToken = jsonResponse.access_token;
            console.log("Access token in code:", accessToken);
            localStorage.setItem("access_token", accessToken);

            const expiresIn = jsonResponse.expires_in;
            const now = new Date();
            const expiry = new Date(now.getTime() + (expiresIn * 1000));
            localStorage.setItem('token_expiry', expiry);
            console.log("Token expiry in code:", localStorage.getItem("token_expiry"));

            setTimeout(() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("token_expiry");
                accessToken = "";
                console.log("Access token expired and removed.");
            }, expiresIn * 1000);

            window.history.pushState({}, null, "/");
            return accessToken;
        }

        const codeVerifier = generateRandomString(128);
        const codeChallenge = await sha256(codeVerifier);
        localStorage.setItem("code_verifier", codeVerifier);

        const redirect =
            `https://accounts.spotify.com/authorize?` +
            `client_id=${clientID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
            `&scope=${scopes.join('%20')}` +
            `&code_challenge_method=S256` +
            `&code_challenge=${codeChallenge}`;

        window.location = redirect;
        return null;
    },

    async search(term) {
        accessToken = await Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
            if (!jsonResponse) {
                console.error("Response error");
            }
            return jsonResponse.tracks.items.map((t) => ({
                id: t.id,
                name: t.name,
                artist: t.artists[0].name,
                album: t.album.name,
                cover: t.album.images[0].url,
                preview: t.preview_url,
                uri: t.uri,
            }));
        });
    },

    async savePlaylist(name, description, coverStr, trackUris) {
        if(!name) name = "New Playlist";
        
        if(!trackUris) return;

        const aToken = await Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${aToken}` };
        const cover = coverStr.split(',')[1];
        let userId;
        let playlistId;

        return fetch(`https://api.spotify.com/v1/me`, { headers: header })
            .then((response) => response.json())
            .then((jsonResponse) => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: header,
                    method: "POST",
                    body: JSON.stringify({ name: name, description: description }),
                });
            })
            .then((response) => response.json())
            .then((jsonResponse) => {
                playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
                    headers: {Authorization: `Bearer ${aToken}`, 'Content-Type': 'image/jpeg'},
                    method: "PUT",
                    body: cover,
                })
                .then(() => {
                    return playlistId;
                })
            .then(() => {
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: header,
                    method: "POST",
                    body: JSON.stringify({ uris: trackUris }),
                });
            });    
            })
            .then(() => {
                return playlistId;
            });
    },

    async logIn() {
        const aToken = await Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${aToken}` };
        
        if(!aToken) {
            return null;
        }

        return fetch(`https://api.spotify.com/v1/me`, {headers: header})
            .then((response) => response.json())
            .then((jsonResponse) => {
                return jsonResponse.display_name;
            });
    },

    async logOut() {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_expiry");
        accessToken = "";
    }
}

export {Spotify};