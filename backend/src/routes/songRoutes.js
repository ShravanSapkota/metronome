import express from "express"
import {getAllSongs,getSongById,searchSong} from "../controllers/songController.js"


const router=express.Router();

router.get("/",getAllSongs);
router.get("/search",searchSong)
router.get("/:id",getSongById)

export default router;