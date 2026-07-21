import pool from "../config/db.js";

const getAllSongs = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM songs LIMIT 20");
        res.status(200).json({
            success: true,
            message: "get all songs controller working",
            songs: rows
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
        console.log(error.message);
    }
}

const searchSong = async (req, res) => {
    try {
        const query = req.query
        if (!query || query == "") {
            return res.status(400).json({
                success: false,
                message: "provide a valid search input"
            })
        }
        const search = `%${query.trim()}%`

        const [rows] = await pool.query(`SELECT  * FROM songs 
            WHERE artist like ?
            OR song like ?
            ORDER BY popularity DESC
            LIMIT 20`,[search,search])

        res.status(200).json({
            success:true,
            message:"search results successfull",
            songs
        })

    }
    catch (error) { 
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export { getAllSongs,searchSong };