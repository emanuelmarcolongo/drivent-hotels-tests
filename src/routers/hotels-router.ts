import { getHotelbyIdController, getHotelsController } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";


const hotelsRouter = Router();

hotelsRouter
.all("/*", authenticateToken)
.get("/", getHotelsController)
.get("/:hotelId", getHotelbyIdController);

export { hotelsRouter };

getHotelbyIdController