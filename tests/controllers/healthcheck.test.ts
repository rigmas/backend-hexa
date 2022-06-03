// @ts-nocheck
import 'reflect-metadata';
import request from 'supertest';

import { createApp } from '../../src/app';
import { HealthcheckController } from '../../src/controllers/healthcheck';

describe('HealthcheckController', () => {
    it('returns healthy status', async () => {
        const app = await createApp();
        app.listen(9003, () => {
            console.log(`Listening on port 9003`);
        });

        const { status, body } = await request(app).get('api/healthcheck/liveness');

        expect(status).toEqual(200);
        expect(body).toEqual({
            status: 'OK'
        });
    });
});
