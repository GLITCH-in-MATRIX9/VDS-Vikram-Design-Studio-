import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

export const errorHandler = (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if ((err as any).name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  if ((err as any).code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate field value entered for '${field}'.`;
    statusCode = 400;
  }

  if ((err as any).name === 'ValidationError') {
    const errors = Object.values((err as any).errors || {}).map((el: any) => el.message);
    message = `Invalid input data: ${errors.join('. ')}`;
    statusCode = 400;
  }

  res.status(statusCode).json({
    message,
  });
};


