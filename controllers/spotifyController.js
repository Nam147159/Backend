//const { config } = require('dotenv');
const config = require('config');
const {
    getAlbumByKey,
    getAlbums,
    search,
    getRecommendationTrack,
    getTracksAlbum,
    recommendation,
    getTracksPlaylist,
    createPlaylist
} = require('../services/spotifyService')

const getAlbum = async (req, res) => {
    try {
        const album = await getAlbumByKey('4aawyAB9vmqN3uQ7FjRGTy');
        if (album) {
            res.status(200).json({ "success": true, "message": "Data successfully queried from the database.", "data": album })
        } else {
            res.status(200).json({ "success": false, "message": "Table PLANS is not found!", "data": [] });
        }
    } catch (e) {
        res.status(200).json({ "success": false, "message": "Table PLANS is not found!", "data": [] });
    }
}
const getAlbumss = async (req, res) => {
    try {
        const album = await getAlbums();
        if (album) {
            res.status(200).json({
                "success": true,
                "message": "Data successfully queried from the database.",
                "data": album
            })
        } else {
            res.status(200).json({ "success": false, "message": "Table PLANS is not found!", "data": [] });
        }
    } catch (e) {
        res.status(200).json({ "success": false, "message": "Table PLANS is not found!", "data": [] });
    }
}

const searchInfo = async (req, res) => {
    try {
        const data = await search(req.query.info);
        if (data) {
            res.status(200).json({
                "success": true,
                "message": "Data successfully queried from the database.",
                "data": data.albums.items
            })
        } else {
            res.status(200).json({ "success": false, "message": "Table PLANS is not found!", "data": [] });
        }
    } catch (e) {
        res.status(200).json({ "success": false, "message": "Table PLANS is not found!", "data": [] });
    }

}
const getRecommendPlaylists = async (req, res) => {
    try {
        const query = 'mới nhất';
        const type = 'playlist';
        const market = "VN"
        const data = await search(query, type, market);
        data.playlists.items.forEach(playlist => {
            console.log(playlist.name)
        })
        res.status(200).json({
            "success": true,
            "message": "Data successfully queried from the database.",
            "data": data.playlists.items
        })
    } catch (err) {
        console.error('Error:', err);
    }
}


const getRecommendArtists = async (req, res) => {
    try {
        const query = 'nghệ sĩ';
        const type = 'artist';
        const market = "VN";
        const data = await search(query, type, market);
        data.artists.items.forEach(artist => {
            console.log(artist.name)
        })

        res.status(200).json({
            "success": true,
            "message": "Data successfully queried from the database.",
            "data": data.artists.items
        })
    } catch (err) {
        console.error('Error:', err);
    }
}

const getRecommendAlbums = async (req, res) => {
    try {
        const query = 'Album';
        const type = 'album';
        const market = "VN";
        const data = await search(query, type, market, 50);
        data.albums.items.forEach(album => {
            console.log(album.name)
        })

        res.status(200).json({
            "success": true,
            "message": "Data successfully queried from the database.",
            "data": data.albums.items
        })
    } catch (err) {
        console.error('Error:', err);
    }
}

const getTop100Playlists = async (req, res) => {
    try {
        const query = 'Top 100 bài nhạc';
        const type = 'playlist';
        const market = "VN";
        // const market = null;
        const data = await search(query, type, market, 50);
        data.playlists.items.forEach(playlist => {
            console.log(playlist.name)
        })

        res.status(200).json({
            "success": true,
            "message": "Data successfully queried from the database.",
            "data": data.playlists.items
        })
    } catch (err) {
        console.error('Error:', err);
    }
}
const getRecommendTrack = async (req, res) => {
    try {
        const data = await recommendation();
        // data.tracks.forEach(track =>{
        //     console.log(track.name)
        // })
        res.status(200).json({
            "success": true,
            "message": "Data successfully queried from the database.",
            "data": data.tracks
        })
    } catch (err) {
        console.error('Error:', err);
    }
}
const getTracksFromPlaylist = async (req, res) => {
    try {

        const data = await getTracksPlaylist(req.query.playlist_id);
        data.forEach(track => {
            console.log("Playlist track", track)
        })

        res.status(200).json({
            "success": true,
            "message": "Data successfully queried from the database.",
            "data": data
        })
    } catch (err) {
        console.error('Error:', err);
    }
}
const getTracksFromAlbum = async (req, res) => {
    try {
        console.log(req.query.album_id)
        const data = await getTracksAlbum(req.query.album_id);

        data.items.forEach(track => {
            console.log("album track", track)
        })

        res.status(200).json({
            "success": true,
            "message": "Data successfully queried from the database.",
            "data": data.items
        })
    } catch (err) {
        console.error('Error:', err);
    }
}

const createNewPlaylist = async (req, res) => {
    try {
        const { name, description, public } = req.body;

        // Kiểm tra playlistName
        if (!name) {
            name = "Default Name";
        }

        // Log thông tin để kiểm tra
        console.log('Received playlist creation request:', {
            name,
            description,
            public
        });

        const playlist = await createPlaylist(name, description, public);

        res.status(201).json({
            success: true,
            message: 'Playlist created successfully',
            data: playlist,
        });
    } catch (err) {
        console.error('Error creating playlist:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create playlist',
            error: err.message,
        });
    }
}


module.exports = {
    getAlbum,
    getAlbumss,
    searchInfo,
    getRecommendPlaylists,
    getRecommendArtists,
    getRecommendAlbums,
    getTop100Playlists,
    getRecommendTrack,
    getTracksFromPlaylist,
    getTracksFromAlbum,
    createNewPlaylist
}