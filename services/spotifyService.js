const config = require("config");
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require("fs");
const { log } = require("console");

const spotifyApi = new SpotifyWebApi({
    clientId: config.get('SPOTIFY.CLIENT_ID'),
    clientSecret: config.get('SPOTIFY.CLIENT_SECRET'),
    redirectUri: 'http://localhost:2204/api/spotify'
});


// const scopes = [
//     'ugc-image-upload',
//     'user-read-playback-state',
//     'user-modify-playback-state',
//     'user-read-currently-playing',
//     'streaming',
//     'app-remote-control',
//     'user-read-email',
//     'user-read-private',
//     'playlist-read-collaborative',
//     'playlist-modify-public',
//     'playlist-read-private',
//     'playlist-modify-private',
//     'user-library-modify',
//     'user-library-read',
//     'user-top-read',
//     'user-read-playback-position',
//     'user-read-recently-played',
//     'user-follow-read',
//     'user-follow-modify'

// ];
// const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
// console.log('Visit this URL to authorize the app:', authorizeURL);


// spotifyApi.authorizationCodeGrant(config.get('SPOTIFY.AUTH_CODE'))
//   .then(data => {
//     console.log('Access token:', data.body.access_token);
//     console.log('Refresh token:', data.body.refresh_token);

//     // Đặt Access Token và Refresh Token vào client
//     spotifyApi.setAccessToken(data.body.access_token);
//     spotifyApi.setRefreshToken(data.body.refresh_token);
//   })
//   .catch(error => {
//     console.error('Error getting tokens:', error);
// });

const updateConfig = (access_token) => {
    const data = fs.readFileSync('default.json');
    const config = JSON.parse(data);

    config.SPOTIFY.ACCESS_TOKEN = access_token;
    fs.writeFileSync('default.json', JSON.stringify(config, null, 2));
}

let tokenExpiryTime = null;

const refreshAccessToken = async () => {
    const authHeader = 'Basic ' + Buffer.from(`${config.get(`SPOTIFY.CLIENT_ID`)}:${config.get(`SPOTIFY.CLIENT_SECRET`)}`).toString('base64');

    const data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', config.get('SPOTIFY.REFRESH_TOKEN'));

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', data, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        spotifyApi.setAccessToken(response.data.access_token);
        tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        return response.data.access_token;

    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}

const isAccessTokenExpired = () => {
    if (Date.now() >= tokenExpiryTime) {
        console.log('Access token has expired');
        return true;
    }
    console.log('Access token is still valid');
    return false;
};

const getAlbumByKey = async (albumKey) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    } // Đảm bảo có token truy cập trước khi thực hiện yêu cầu API
    try {
        const data = await spotifyApi.searchAlbums(albumKey);
        // console.log('Album information', data.body);
        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
    }
};

const searchAlbum = async (albumKey) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    } // Đảm bảo có token truy cập trước khi thực hiện yêu cầu API
    try {
        const data = await spotifyApi.searchAlbums("Albums Viet Nam phổ biến năm 2024", { type: "album", market: "VN" });
        // console.log('Album information', data.body);
        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
    }
};

const getAlbums = async () => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    } // Đảm bảo có token truy cập trước khi thực hiện yêu cầu API
    try {
        const data = await spotifyApi.getNewReleases();

        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
    }
}
const search = async (query, type, market, limit) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }
    const token = spotifyApi.getAccessToken();
    if (type == null) {
        type = ['album', 'artist', 'playlist', 'track'].join(',');
    }
    let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`;
    if (market) {
        url = url + `&market=${market}`
    }
    if (limit) {
        url = url + `&limit=${limit}`
    }

    // console.log("url " + url)
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.error('Something went wrong when searching for Vietnamese playlists', err);
    }
}
const searchArtists = async (query) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }
    try {
        const data = await spotifyApi.searchArtists(query, { limit: 10 });
        const artists = data.body.artists.items;
        return artists;
    } catch (err) {
        console.error('Something went wrong when searching for artists', err);
    }
};
const getTracksPlaylist = async (query) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }
    try {
        const data = await spotifyApi.getPlaylist(query);
        const tracks = data.body.tracks.items;
        // console.log(playlist)
        return tracks;
    } catch (err) {
        console.error('Something went wrong when searching for artists', err);
    }
};
const getTracksAlbum = async (query) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }
    try {
        const data = await spotifyApi.getAlbum(query);
        const albums = data.body.tracks;
        // console.log(albums)
        return albums;
    } catch (err) {
        console.error('Something went wrong when searching for album', err);
    }
};

const recommendation = async () => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }
    const option = {
        seed_artists: '5dfZ5uSmzR7VQK0udbAVpf',
        seed_genres: 'pop, hip-hop',
        seed_tracks: '31VNCmwspR7nVJ6kruUuJt'
    }
    try {
        const data = await spotifyApi.getRecommendations(option);
        // console.log('Album information', data);
        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
    }
};

const createPlaylist = async (name, description, public = false) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }

    const token = spotifyApi.getAccessToken();
    const url = `https://api.spotify.com/v1/users/${config.get(`SPOTIFY.USER_ID`)}/playlists`;

    const body = {
        name,
        description,
        public: public
    };
    try {
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Playlist created successfully:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error creating playlist:', err);
        throw err;
    }
}

const getToken = async () => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }
    try {
        const token = spotifyApi.getAccessToken();
        console.log(token);
        return token;
    } catch (err) {
        console.error('Error get token:', err);
        throw err;
    }
}

const getTrackByID = async (trackID) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    }
    try {
        const data = await spotifyApi.getTrack(trackID);
        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the track', err);
    }
};

module.exports = {
    getAlbumByKey,
    getAlbums,
    search,
    searchArtists,
    recommendation,
    searchAlbum,
    getTracksPlaylist,
    getTracksAlbum,
    createPlaylist,
    getToken,
    getTrackByID
}