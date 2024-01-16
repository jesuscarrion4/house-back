import express from "express"
import apiRouter from "./routers/index.router.js";
import errorHandler from "./middlewares/errorHandler.js";
import pathHandler from "./middlewares/pathHandler.js";
import __dirname from "./utils.js"
import morgan from "morgan";

const server = express()
const PORT = 8080
const ready = ()=>console.log("server ready on port "+PORT);
server.listen(PORT,ready)

//middlewares
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static(__dirname+ "/public"))
server.use(morgan("dev"))
server.use("/",apiRouter)
server.use(errorHandler)
server.use(pathHandler)