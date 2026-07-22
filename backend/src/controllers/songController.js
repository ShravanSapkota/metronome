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
        const { query, minbpm, maxbpm } = req.query

        let sql = "SELECT * FROM songs WHERE 1=1 "
        let values = []

        if (!query && !(minbpm && maxbpm)) {
            return res.status(500).json({
                success: false,
                message: "please enter a valid search input or bpm range"
            })
        }
        if (query) {
            const trimmedQuery = query.trim()
            sql += "AND (song like ? OR artist like ?) "
            values.push(`%${trimmedQuery}%`, `%${trimmedQuery}%`)
        }
        if (minbpm && maxbpm) {
            const min = Number(minbpm);
            const max = Number(maxbpm);

            if (Number.isNaN(min) || Number.isNaN(max)) {
                return res.status(400).json({
                    success: false,
                    message: "BPM values must be valid numbers."
                });
            }
            sql += "AND (tempo between ? AND ?) "
            values.push(min, max)
        }

        sql += "ORDER BY popularity DESC"

        const [rows] = await pool.query(sql, values);

        res.json({
            success: true,
            songs: rows,
            count: rows.length
        })

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export { getAllSongs, searchSong };