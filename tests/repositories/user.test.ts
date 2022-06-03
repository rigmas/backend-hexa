// @ts-nocheck

import { createConnection, getCustomRepository } from 'typeorm';

import { OrmConfig } from '../../src/ormconfig';
import { connect } from '../../src/util/db-connect';
import { User } from '../../src/entities/user';
import { UserRepository } from '../../src/repositories/user';
import { createTestConnection } from '../helpers/connection';

describe('UserRepository', () => {
    it('should be connected to db', async () => {
        await createConnection();
        await connect();
    });

    const userRepo = getCustomRepository(UserRepository);
    let ids = [];

    it('should have a method called saveUser', () => {
        expect(userRepo.saveUser).toBeDefined();
    });

    it('should call the create method on the database when invoking the saveUser method on userRepository', async (done) => {
        const spy = jest.spyOn(userRepo.saveUser, 'create');
        await userRepo.saveUser({ firstName: 'John', lastName: 'Doe', address: 'Jakarta', isActive: true });

        expect(spy).toHaveBeenCalled();
        done();
    });

    it('the saveUser method should return a new user', async (done) => {
        const createdUser = await userRepo.saveUser({
            firstName: 'John',
            lastName: 'Doe',
            address: 'Jakarta',
            isActive: true
        });
        ids.push(createdUser.id);

        expect(await userRepo.findOne(createdUser.id)).toEqual({
            id: createdUser.id,
            firstName: 'John',
            lastName: 'Doe',
            address: 'Jakarta',
            isActive: true
        } as User);

        done();
    });

    afterEach(async () => {
        await userRepo.clearData(ids);
    });
});
