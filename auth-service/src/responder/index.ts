import { Response } from "express";

export const respondeWithError = (
  res: Response,
  status: number,
  error: string,
  payload?: any
) => {
  res.status(status).json({ error, payload });
};

export const respondWithSuccess = (
  res: Response,
  status: number = 200,
  message: string,
  payload?: any
) => {
  res.status(status).json({ message, payload });
};
