import express from "express"
import {getAllSongs,searchSong} from "../controllers/songController.js"


const router=express.Router();

router.get("/",getAllSongs);
router.get("/search",searchSong)

export default router;