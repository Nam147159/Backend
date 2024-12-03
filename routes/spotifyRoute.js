const express = require('express');
const router = express.Router();

const {
    getAlbum,
    getAlbumss,
    searchInfo,
    getRecommendPlaylists,
    getRecommendArtists,
    getRecommendAlbums,
    getTop100Playlists,
    getRecommendTrack,
    getTracksFromPlaylist,
    getTracksFromAlbum
} = require('../controllers/spotifyController')


router.route('/album/get/albums').get(getAlbumss);
router.route('/search').get(searchInfo);
router.route('/recommendation/playlist').get(getRecommendPlaylists);
router.route('/recommendation/artist').get(getRecommendArtists);
router.route('/recommendation/album').get(getRecommendAlbums);
router.route('/recommendation/top100').get(getTop100Playlists);
router.route('/recommendation/track').get(getRecommendTrack);
router.route('/playlist/get/track').get(getTracksFromPlaylist);
router.route('/album/get/track').get(getTracksFromAlbum);

module.exports = router;