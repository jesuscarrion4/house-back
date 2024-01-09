import express from "express";
import userManager from "./data/files/userManager.js";


const server = express();
const port = 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const ready = () => "server ready on port" + port;
server.listen(port, ready);


server.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      const createdUser = await userManager.create(userData);
  
      return res.json({
        statuscode: 201,
        Response: createdUser,
      });
    } catch (error) {
      return res.json({
        statuscode: 500,
        message: error.message,
      });
    }
  });
  
  server.get("/api/users", async (req, res) => {
    try {
      const all = await userManager.read();
  
      if (all.length === 0) {
        return res.json({
          statuscode: 404,
          message: "Not found users",
        });
      }
  
      return res.json({
        statuscode: 200,
        Response: all,
      });
    } catch (error) {
      return res.json({
        statuscode: 500,
        message: error.message,
      });
    }
  });
  
  server.get("/api/users/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const one = await userManager.readOne(uid);
  
      if (!one) {
        return res.json({
          statuscode: 404,
          message: "User not found",
        });
      }
  
      return res.json({
        statuscode: 200,
        Response: one,
      });
    } catch (error) {
      return res.json({
        statuscode: 500,
        message: error.message,
      });
    }
  });