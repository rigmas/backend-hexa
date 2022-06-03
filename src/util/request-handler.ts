import { Request, Response, NextFunction } from 'express';

export const handler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
