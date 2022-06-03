// @ts-nocheck
import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import { UserRepository } from '../../src/repositories/user';
import { UserService } from '../../src/services/user';

describe('UserService', () => {
    const userRepo = getCustomRepository(UserRepository);
    const userService = new UserService(userRepo);

    let ids = [];

    it('Should have access to the user repository for create new user', () => {
        expect(userService.createNewUser).toBeDefined();
    });

    it('should call the createNewUser method on create new user method on the service gets invoked', async (done) => {
        const spy = jest.spyOn(userService.createNewUser, 'createNewUser');
        await userService.createNewUser({ firstName: 'John', lastName: 'Doe', address: 'Jakarta', isActive: true });

        expect(spy).toHaveBeenCalled();
        done();
    });

    it('should return created user', async (done) => {
        const createdUser1 = await userRepo.saveUser({
            firstName: 'John',
            lastName: 'Doe',
            address: 'Jakarta',
            isActive: true
        });

        const createdUser2 = await userRepo.saveUser({
            firstName: 'Anonym',
            lastName: 'Doe',
            address: 'Jakarta Barat',
            isActive: true
        });

        ids = [createdUser1.id, createdUser2.id];

        expect(await userService.getDetail({ id: createdUser1.id })).toEqual({
            id: createdUser1.id,
            firstName: 'John',
            lastName: 'Doe',
            address: 'Jakarta',
            isActive: true
        } as User);

        expect(await userService.getDetail({ id: createdUser2.id })).toEqual({
            id: createdUser2.id,
            firstName: 'Anonym',
            lastName: 'Doe',
            address: 'Jakarta Barat',
            isActive: true
        } as User);

        done();
    });

    afterEach(async () => {
        await userRepo.clearData(ids);
    });
});
