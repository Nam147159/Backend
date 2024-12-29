const config = require("config");
const { Pool } = require('pg');

const dbConfig = config.get('DATABASE.POSTGRESQL');
const pool = new Pool({
    user: dbConfig.USER,
    host: dbConfig.HOST,
    database: dbConfig.DATABASE,
    password: dbConfig.PASSWORD,
    port: dbConfig.PORT,
});

const savePlaylistToDB = async (playlistID, ownerID, name, description, public) => {
    const query = `
        INSERT INTO playlists (id, owner_id, name, description, public)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [playlistID, ownerID, name, description, public];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error saving playlist to database:', err);
        throw err;
    }
};

const getUserIDFromDB = async (username) => {
    const query = `
        SELECT id FROM users WHERE username = $1;
    `;
    const values = [username];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error getting user ID:', err);
        throw err;
    }
}

const getPlaylistsFromDB = async (ownerID) => {
    const query = `
        SELECT * FROM playlists WHERE owner_id = $1;
    `;
    const values = [ownerID];
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error getting playlists from database:', err);
        throw err;
    }
}

module.exports = {
    savePlaylistToDB,
    getUserIDFromDB,
    getPlaylistsFromDB
};