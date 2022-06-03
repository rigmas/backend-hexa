import _ from 'lodash';
import { User } from 'src/entities/user';
import { INewUserRequestData } from 'src/interface/user-interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserRepo {
    saveUser(userData: User): Promise<User | null>;
    findAll(limit: number, offset: number): Promise<User[] | null>;
    findDetail(id: number): Promise<User | null>;
    updateUser(id: number, firstName: string, lastName: string, address: string): Promise<any | null>;
    deleteUser(id: number, isActive: boolean): Promise<any>;
}

export class UserService {
    private readonly userRepository: IUserRepo;

    public constructor(userRepository: IUserRepo) {
        this.userRepository = userRepository;
    }

    async createNewUser(payload: INewUserRequestData): Promise<User | any> {
        const { firstName, lastName, address, isActive } = payload;

        if (!firstName || !lastName || !address || isActive == null) {
            throw new Error('Invalid input');
        }

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.address = address;
        user.isActive = isActive;

        try {
            const savedUser = await this.userRepository.saveUser(user);
            // const { id, firstName, lastName, address, isActive } = savedUser;
            return { ...savedUser };
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async getUsers(query: any): Promise<User[] | any> {
        const { limit, offset } = query;

        if (!_.isNumber(+limit) || !_.isNumber(+offset)) {
            throw new Error('Invalid query input');
        }

        try {
            return await this.userRepository.findAll(limit, offset);
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async getDetail(queryPath: any): Promise<User | any> {
        const { id } = queryPath;

        try {
            return await this.userRepository.findDetail(id);
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async editUser(queryPath: any, payload: INewUserRequestData): Promise<any> {
        const { id } = queryPath;
        const { firstName, lastName, address } = payload;

        try {
            return await this.userRepository.updateUser(id, firstName, lastName, address);
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async removeUser(queryPath: any): Promise<any> {
        const { id } = queryPath;

        try {
            const isActive = false;
            return await this.userRepository.deleteUser(id, isActive);
        } catch (e) {
            console.log(e);
        }
        return false;
    }
}
