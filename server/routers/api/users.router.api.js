import { Router } from "express";
import userManager from "../../src/data/fs/userManager.js";


const usersRouter = Router();


usersRouter.post("/api/users", async (req, res) => {
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
  
  usersRouter.get("/api/users", async (req, res) => {
    try {
      const all = await userManager.read();
  
      if (all.length === 0) {
        // throw new Error("Not found users");
  
        return res.json({
          statuscode: 404,
          message: error.message,
        });
      }
      console.log(all);
      return res.json({
        statuscode: 200,
        Response: all,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        statuscode: 500,
        message: error.message,
      });
    }
  });
  
  usersRouter.get("/api/users/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const one = await userManager.readOne(uid);
      if (!one) {
        return res.json({
          statuscode: 404,
          message: "user not found",
        });
      }
      console.log(one);
  
      return res.json({
        statuscode: 200,
        Response: one,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        statuscode: 500,
        message: error.message,
      });
    }
  });
  export default usersRouter;