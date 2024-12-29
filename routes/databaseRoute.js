const express = require('express');
const router = express.Router();
const { saveNewPlaylist, getUserID } = require('../controllers/databaseController');

router.route('/save-new-playlist').post(saveNewPlaylist);
router.route('/get-user-id').get(getUserID);

module.exports = router;