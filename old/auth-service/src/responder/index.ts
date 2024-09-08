import { Response } from "express";

export const Error = (
  res: Response,
  status: number,
  error: string,
  payload?: any
) => {
  res.status(status).json({ error, payload });
};

export const Success = (
  res: Response,
  status: number = 200,
  message: string,
  payload?: any
) => {
  res.status(status).json({ message, payload });
};
