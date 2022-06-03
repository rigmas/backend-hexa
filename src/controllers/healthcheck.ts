import { Request, Response, Router } from 'express';

import { logger } from 'src/util/logger';

export class HealthcheckController {
    private router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', HealthcheckController.index);
        this.router.get('/liveness', HealthcheckController.checkHealth);
        this.router.get('/readiness', HealthcheckController.checkHealth);
    }

    getRouter() {
        return this.router;
    }

    /**
     * GET /healthcheck
     *
     */
    static index(_: Request, res: Response) {
        return res.status(200).json({ message: 'OK' });
    }

    static checkHealth(_: Request, res: Response) {
        if (process.uptime()) {
            logger.info(
                {
                    uptime: process.uptime(),
                    message: 'Ok',
                    date: new Date()
                },
                'healthcheck status'
            );
            return res.status(200).json({ status: 'OK' });
        }

        return res.status(500).json({
            error_code: 'INTERNAL_SERVER_ERROR',
            message: 'health status is bad',
            errors: ['process uptime is not working', {}]
        });
    }
}
