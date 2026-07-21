import express from "express";
import cors from "cors";
import songRoutes from "./routes/songRoutes.js";

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Metronome API is running");
})

app.use("/api/songs",songRoutes)

export default app;