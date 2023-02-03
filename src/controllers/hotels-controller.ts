import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotelsController(req: AuthenticatedRequest, res: Response) {
    const {userId} = req;

  try {
    const data = await hotelService.getHotels(userId);
    console.log(data);

    return res.status(200).send(data);
    
  } catch (error) {
    if (error.type === 'NotFound') {
        return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.type === 'Payment Required') {
        return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    return res.status(400).send({});
  }
}

export async function getHotelbyIdController(req: AuthenticatedRequest, res: Response) {
    const {userId} = req;
    const {hotelId} = req.params;

    const hotel_id = Number(hotelId);

  try {
    const data = await hotelService.getHotelbyId(userId, hotel_id)

    return res.status(200).send(data);
    
  } catch (error) {
    if (error.type === 'NotFound') {
        return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.type === 'Payment Required') {
        return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    return res.status(400).send({});
  }
}