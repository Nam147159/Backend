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

// Danh sách scope cần thiết
// const scopes = [
//     'playlist-modify-public',    // Tạo và chỉnh sửa playlist công khai
//     'playlist-modify-private',   // Tạo và chỉnh sửa playlist riêng tư
//     'user-read-private',         // Đọc thông tin người dùng
//     'user-library-read',         // Truy cập thư viện bài hát
//     'user-library-modify'        // Thêm/xóa bài hát khỏi thư viện
//   ];
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

// const updateConfig = (access_token) => {
//     const data = fs.readFileSync('default.json');
//     const config = JSON.parse(data);

//     config.SPOTIFY.ACCESS_TOKEN = access_token;
//     fs.writeFileSync('default.json', JSON.stringify(config, null, 2));
// }

let tokenExpirationTime = 0;
let expiresIn = 0;
let tokenExpiryTime = null;

const refreshAccessToken = async() => {
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

        console.log(response);
        
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

const ensureAccessToken = async () => {
    // Kiểm tra nếu token vẫn còn hạn
    // if (Date.now() < tokenExpirationTime) {
    //     return;
    // }

    // if (isAccessTokenExpired()) {
    //     getNewAccessToken();
    // } else {
    //     console.log('Access token is still valid');
    // }

    // try {
    //     console.log('Refreshing access token...');
    //     const data = await spotifyApi.clientCredentialsGrant();
    //     const accessToken = data.body['access_token'];
    //     const expiresIn = data.body['expires_in'];

    //     // Đặt Access Token và thời gian hết hạn
    //     spotifyApi.setAccessToken(accessToken);
    //     console.log('New access token:', spotifyApi.getAccessToken());

    //     // Cập nhật thời gian hết hạn (trừ đi 1 phút để an toàn)
    //     tokenExpirationTime = Date.now() + (expiresIn - 60) * 1000;

    //     console.log(`Token will expire at: ${new Date(tokenExpirationTime).toISOString()}`);
    // } catch (err) {
    //     console.error('Error refreshing access token:', err);
    //     throw new Error('Failed to refresh access token');
    // }
};

const getAlbumByKey = async (albumKey) => {
    if (isAccessTokenExpired()) {
        await refreshAccessToken();
    } // Đảm bảo có token truy cập trước khi thực hiện yêu cầu API
    try {
        const data = await spotifyApi.searchAlbums(albumKey);
        console.log('Album information', data.body);
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
        console.log('Album information', data.body);
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
        console.log(albums)
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
        console.log('Album information', data);
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

module.exports = {
    getAlbumByKey,
    getAlbums,
    search,
    searchArtists,
    recommendation,
    searchAlbum,
    getTracksPlaylist,
    getTracksAlbum,
    createPlaylist
}