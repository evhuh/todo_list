require("dotenv").config();
const express = require ("express");
const {connectToMongoDB } = require("./database");
const path = require("path");

// create instance of express
const app = express();
app.use(express.json()); // let us read json objects and sent it to the server

// server build folder
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build/index.html"));
})


// import router
const router = require("./routes");
app.use("/api", router);

const port = process.env.PORT || 3000;

async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port})`);
    });
}

startServer();
