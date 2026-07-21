import pool  from "../config/db";

const getAllSongs=async (req,res)=>{
    try{
    const [rows]=await pool.query("SELECT * FROM songs");
    res.status(200).json({
        success:true,
        message:"get all songs controller working",
        songs:rows
    });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"server error"
        })
        console.log(error.message);
    }
}

export {getAllSongs};