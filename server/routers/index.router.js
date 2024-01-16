import { Router } from "express";
import productRouter from "./api/product.router.api.js";
import usersRouter from "./api/users.router.api.js";
import ordenesRouter from "./api/orden.router.api.js";

const apiRouter = Router()

apiRouter.use("/api", apiRouter)
//definir los enrutadores de los recursos
apiRouter.use("/product",productRouter)
apiRouter.use("/users",usersRouter)
apiRouter.use("/orden",ordenesRouter)

export default apiRouter;
//export el enrutador de la API para poder implementarlo en el enrutador del servidor