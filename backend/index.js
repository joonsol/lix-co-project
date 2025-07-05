require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express();
const PORT = 3000;



const userRoutes = require('./routes/user')
const contactRoutes = require('./routes/contact')
const postRoutes = require('./routes/post')
const uploadRoutes = require('./routes/upload')

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://lix-co-project.vercel.app/"
    ],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())


app.use("/api/auth", userRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/post", postRoutes)
app.use("/api/upload", uploadRoutes)
app.get("/", (req, res) => {
    res.send("Hello, world");
})


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => { console.log("연결 성공") })
    .catch((error) => console.log("실패", error))

app.listen(PORT, () => {
    console.log("Server is running");
})