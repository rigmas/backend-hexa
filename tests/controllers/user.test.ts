// @ts-nocheck
import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import { UsersController } from '../../src/controllers/user';
import { UserService } from '../../src/services/user';
import { UserRepository } from '../../src/repositories/user';

describe('UsersController', () => {
    const userRepo = getCustomRepository(UserRepository);
    const userService = new UserService(userRepo);
    const userController = new UsersController(userService);

    it('should have method called storeUser', () => {
        expect(userController.storeUser).toBeDefined();
    });

    it('should make a call to storeUser to create new user', async (done) => {
        const spy = jest.spyOn(userController.storeUser, 'storeUser');

        await userController.storeUser({
            firstName: 'John',
            lastName: 'Doe',
            address: 'Jakarta',
            isActive: true
        });

        expect(spy).toHaveBeenCalled();
        done();
    });

    it('should return created user data', async (done) => {
        const createdUser1 = await userController.storeUser({
            firstName: 'John',
            lastName: 'Doe',
            address: 'Jakarta',
            isActive: true
        });

        const createdUser2 = await userController.storeUser({
            firstName: 'Anonym',
            lastName: 'Doe',
            address: 'Jakarta Barat',
            isActive: true
        });

        ids = [createdUser1.id, createdUser2.id];

        const result1 = await userController.fetchDetail({ id: createdUser1.id });
        const result2 = await userController.fetchDetail({ id: createdUser2.id });

        expect(result1.firstName).toBe('John');
        expect(result2.firstName).toBe('Anonym');

        done();
    });
});
