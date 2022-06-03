import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/entities/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findByName(firstName: string, lastName: string) {
        try {
            return await this.createQueryBuilder('user')
                .where('user.firstName = :firstName', { firstName })
                .andWhere('user.lastName = :lastName', { lastName })
                .getMany();
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    public saveUser = async (user: User): Promise<User | any> => {
        try {
            return await this.save(user);
        } catch (e) {
            console.log(e);
        }
        return false;
    };

    async findAll(limit: number, offset: number): Promise<User[] | any> {
        try {
            return await this.createQueryBuilder('user').limit(limit).offset(offset).getMany();
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    public findDetail = async (id: number): Promise<User | any> => {
        try {
            return await this.findOne(id);
        } catch (e) {
            console.log(e);
        }
        return false;
    };

    public updateUser = async (id: number, firstName: string, lastName: string, address: string): Promise<any> => {
        try {
            return await this.update(id, { firstName, lastName, address });
        } catch (e) {
            console.log(e);
        }
        return false;
    };

    public deleteUser = async (id: number, isActive: boolean): Promise<any> => {
        try {
            return await this.update(id, { isActive });
        } catch (e) {
            console.log(e);
        }
        return false;
    };

    public clearData = async (ids: number[]): Promise<any> => {
        try {
            const data = await this.findByIds(ids);
            if (!data) return;
            return await this.remove(data);
        } catch (e) {
            console.log(e);
        }
        return false;
    };
}
