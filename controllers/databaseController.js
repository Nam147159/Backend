const { savePlaylistToDB, getUserIDFromDB, getPlaylistsFromDB } = require('../services/databaseService');

const saveNewPlaylist = async (req, res) => {
    try {
        const { playlistID, ownerID, playlistName, description, isPublic } = req.body;

        const savedPlaylist = await savePlaylistToDB(playlistID, ownerID, playlistName, description, isPublic);

        res.status(201).json({
            success: true,
            message: 'Playlist saved successfully',
            data: savedPlaylist,
        });
    } catch (err) {
        console.error('Error saving playlist:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to save playlist',
            error: err.message,
        });
    }
};

const getUserID = async (req, res) => {
    try {
        const userID = await getUserIDFromDB(req.query.username);
        res.status(200).json({
            success: true,
            userID: userID,
        });
    } catch (err) {
        console.error('Error fetching user ID:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user ID',
            error: err.message,
        });
    }
};

const getPlaylists = async (req, res) => {
    try {
        const playlists = await getPlaylistsFromDB(req.query.ownerID);
        res.status(200).json({
            success: true,
            playlists: playlists,
        });
    } catch (err) {
        console.error('Error fetching playlists:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch playlists',
            error: err.message,
        });
    }
};

module.exports = {
    saveNewPlaylist,
    getUserID,
    getPlaylists
}