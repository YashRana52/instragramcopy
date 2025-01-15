import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { urlencoded } from "express";
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import connectDb from "./utils/db.js";

dotenv.config({}); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: process.env.URL, 
    credentials: true,
};
app.use(cors(corsOptions));
// api bnani h yha pe
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

// Routes
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "I am coming from backend",
        success: true,
    });
});

// Server and Database Connection

app.listen(PORT, () => {
   connectDb();
    console.log(`Server listening at http://localhost:${PORT}`);
});
