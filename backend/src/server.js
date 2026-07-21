import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config()

const PORT = process.env.PORT || 5000;

const startserver = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to mysql database");
        connection.release();
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.log("connection failed",error.message)
    }
}

startserver();
