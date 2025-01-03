const { get } = require('config');
const {
    savePlaylistToDB,
    getUserIDFromDB,
    getPlaylistsFromDB,
    getPlaylistByIDFromDB,
    changePlaylistNameInDB,
    addTrackToPlaylistInDB,
    getTracksInPlaylistInDB,
    deleteTrackInPlaylistInDB } = require('../services/databaseService');

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

const getPlaylistByID = async (req, res) => {
    try {
        const playlist = await getPlaylistByIDFromDB(req.query.playlistID);
        res.status(200).json({
            success: true,
            playlist: playlist,
        });
    } catch (err) {
        console.error('Error fetching playlist:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch playlist',
            error: err.message,
        });
    }
};

const changePlaylistName = async (req, res) => {
    try {
        const { playlistID, newName } = req.body;

        const updatedPlaylist = await changePlaylistNameInDB(playlistID, newName);

        res.status(200).json({
            success: true,
            message: 'Playlist name updated successfully',
            data: updatedPlaylist,
        });
    } catch (err) {
        console.error('Error updating playlist name:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update playlist name',
            error: err.message,
        });
    }
}

const addTrackToPlaylist = async (req, res) => {
    try {
        const { playlistID, trackID } = req.body;

        const updatedPlaylist = await addTrackToPlaylistInDB(playlistID, trackID);

        res.status(200).json({
            success: true,
            message: 'Track added to playlist successfully',
            data: updatedPlaylist,
        });
    } catch (err) {
        console.error('Error adding track to playlist:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add track to playlist',
            error: err.message,
        });
    }
}

const getTracksInPlaylist = async (req, res) => {
    try {
        const playlistID = req.query.playlistID;
        console.log('Requested playlist ID:', playlistID);
        const tracks = await getTracksInPlaylistInDB(playlistID);
        console.log('Tracks found:', tracks);
        res.status(200).json({
            success: true,
            tracks: tracks,
        });
    } catch (err) {
        console.error('Error fetching tracks in playlist:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tracks in playlist',
            error: err.message,
        });
    }
}

const deleteTrackInPlaylist = async (req, res) => {
    try {
        const { playlistID, trackID } = req.body;

        if (!playlistID || !trackID) {
            return res.status(400).json({
                success: false,
                message: 'Playlist ID and Track ID are required in request body'
            });
        }

        const result = await deleteTrackInPlaylistInDB(playlistID, trackID);

        res.status(200).json({
            success: true,
            message: 'Track deleted from playlist successfully',
            data: result,
        });
    } catch (err) {
        console.error('Error deleting track from playlist:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete track from playlist',
            error: err.message,
        });
    }
}

module.exports = {
    saveNewPlaylist,
    getUserID,
    getPlaylists,
    getPlaylistByID,
    changePlaylistName,
    addTrackToPlaylist,
    getTracksInPlaylist,
    deleteTrackInPlaylist
}