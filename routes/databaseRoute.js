const express = require('express');
const router = express.Router();

const { saveNewPlaylist, getUserID, getPlaylists, getPlaylistByID } = require('../controllers/databaseController');

router.route('/save-new-playlist').post(saveNewPlaylist);
router.route('/get-user-id').get(getUserID);
router.route('/get-playlists').get(getPlaylists);
router.route('/get-playlist-by-id').get(getPlaylistByID);

module.exports = router;