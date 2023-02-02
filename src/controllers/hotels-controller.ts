import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotelsController(req: AuthenticatedRequest, res: Response) {
  try {

    
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
