import pool from "../config/db.js";

const getAllSongs = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.query
        page = Number(page)
        limit = Number(limit)

        if ((Number.isNaN(page) || Number.isNaN(limit)) || (page < 1 || limit < 1)) {
            return res.status(500).json({
                success: false,
                message: "please provide a valid page and limit"
            })
        }

        const offset=(page-1)*limit;

        const [songs] = await pool.query("SELECT * FROM songs ORDER BY popularity DESC LIMIT ? OFFSET ?",[limit,offset]);


        const [totalrows]=await pool.query("SELECT COUNT(*) AS total FROM songs")

        const total = totalrows[0].total
        const totalPages=Math.ceil(total/limit)

        res.status(200).json({
            success: true,
            total,
            totalPages,
            songs
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


const getSongById= async (req,res)=>{
    try{
        const {id}=req.params;
        if(isNaN(id)|| id<1){
            return res.status(500).json({
                success:false,
                message: "provide a valid song id"
            })
        }
        const [rows]=await pool.query("SELECT  * FROM songs where id=?",[Number(id)])
        if(rows.length==0){
            return res.status(500).json({
                success:false,
                message: "song of the id not found"
            })
        }
        res.status(200).json({
            success:true,
            song: rows[0]
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "Internal server error"
        })

    }
}

export { getAllSongs, searchSong, getSongById};