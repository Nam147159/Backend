const config = require("config");
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: config.get('SPOTIFY.CLIENT_ID'),
    clientSecret: config.get('SPOTIFY.CLIENT_SECRET'),
    redirectUri: 'http://localhost:2204/api/spotify'
});

let tokenExpirationTime = 0;

const ensureAccessToken = async () => {
    if (Date.now() < tokenExpirationTime) {
        return;
    }

    try {
        const data = await spotifyApi.clientCredentialsGrant();
        const accessToken = data.body['access_token'];
        const expiresIn = data.body['expires_in'];

        spotifyApi.setAccessToken(accessToken);
        console.log(spotifyApi.getAccessToken());

        // Set thời gian hết hạn (trừ đi 5 phút để an toàn)
        tokenExpirationTime = Date.now() + (expiresIn - 300) * 1000;

        console.log('Access token renewed');
    } catch (err) {
        console.error('Error retrieving access token', err);
        throw err;
    }
};

const getAlbumByKey = async (albumKey) => {
    await ensureAccessToken(); // Đảm bảo có token truy cập trước khi thực hiện yêu cầu API
    try {
        const data = await spotifyApi.searchAlbums(albumKey);
        console.log('Album information', data.body);
        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
    }
};

const searchAlbum = async (albumKey) => {
    await ensureAccessToken(); // Đảm bảo có token truy cập trước khi thực hiện yêu cầu API
    try {
        const data = await spotifyApi.searchAlbums("Albums Viet Nam phổ biến năm 2024", {type: "album", market: "VN"});
        console.log('Album information', data.body);
        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
    }
};

const getAlbums = async ()=>{
    await ensureAccessToken(); // Đảm bảo có token truy cập trước khi thực hiện yêu cầu API
    try {
        const data = await spotifyApi.getNewReleases();

        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
    }
}
const search = async (query, type, market, limit)=>{
        await ensureAccessToken();
        const token = spotifyApi.getAccessToken();
        if(type == null){
            type = ['album', 'artist', 'playlist', 'track'].join(',');
        }
        let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`;
        if(market){
            url = url + `&market=${market}`
        }
        if(limit){
            url = url + `&limit=${limit}`
        }

    console.log("url " + url)
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
    await ensureAccessToken();
    try {
        const data = await spotifyApi.searchArtists(query, { limit: 10 });
        const artists = data.body.artists.items;
        return artists;
    } catch (err) {
        console.error('Something went wrong when searching for artists', err);
    }
};
const getTracksPlaylist = async (query) => {
    await ensureAccessToken();
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
    await ensureAccessToken();
    try {
        const data = await spotifyApi.getAlbum(query);
        const albums = data.body.tracks;
        console.log(albums)
        return albums;
    } catch (err) {
        console.error('Something went wrong when searching for album', err);
    }
};

const recommendation = async () => {
    await ensureAccessToken();
    const option = {
        seed_artists: '5dfZ5uSmzR7VQK0udbAVpf',
        seed_genres: 'pop, hip-hop',
        seed_tracks: '31VNCmwspR7nVJ6kruUuJt'
    }
    try {
        const data = await spotifyApi.getRecommendations(option);
        console.log('Album information', data);
        return data.body;
    } catch (err) {
        console.error('Something went wrong when retrieving the album', err);
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
    getTracksAlbum
}