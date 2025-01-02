const express = require('express');
const router = express.Router();

const {
    saveNewPlaylist,
    getUserID,
    getPlaylists,
    getPlaylistByID,
    changePlaylistName,
    addTrackToPlaylist,
    getTracksInPlaylist } = require('../controllers/databaseController');

router.route('/save-new-playlist').post(saveNewPlaylist);
router.route('/get-user-id').get(getUserID);
router.route('/get-playlists').get(getPlaylists);
router.route('/get-playlist-by-id').get(getPlaylistByID);
router.route('/change-playlist-name').put(changePlaylistName);
router.route('/add-track-to-playlist').post(addTrackToPlaylist);
router.route('/get-tracks-in-playlist').get(getTracksInPlaylist);

module.exports = router;