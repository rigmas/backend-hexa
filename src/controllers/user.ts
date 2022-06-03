import { NextFunction, Request, Response, Router } from 'express';
import { User } from 'src/entities/user';
import { INewUserRequestData } from 'src/interface/user-interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserService {
    createNewUser(payload: INewUserRequestData): Promise<User | null>;
    getUsers(query: any): Promise<User[] | null>;
    getDetail(queryPath: any): Promise<User | null>;
    editUser(queryPath: any, payload: INewUserRequestData): Promise<any | null>;
    removeUser(queryPath: any): Promise<any>;
}

export class UsersController {
    private readonly userService: IUserService;

    private router: Router;

    public constructor(userService: IUserService) {
        this.router = Router();
        this.router.get('/:id', this.fetchDetail);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
        this.router.post('/', this.storeUser);
        this.router.get('/', this.fetchUsers);
        this.userService = userService;
    }

    getRouter() {
        return this.router;
    }

    public storeUser = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const userCreated = await this.userService.createNewUser(_.body);
            return res.status(200).json({ ...userCreated });
        } catch (e) {
            next(e);
        }
        return false;
    };

    public fetchUsers = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getUsers(_.query);
            return res.status(200).json(users);
        } catch (e) {
            next(e);
        }
        return false;
    };

    public fetchDetail = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const detail = await this.userService.getDetail(_.params);
            if (detail) {
                return res.status(200).json(detail);
            }
            return res.status(400).json({ message: 'Invalid input ID', error_code: 'API_VALIDATION_ERROR' });
        } catch (e) {
            next(e);
        }
        return false;
    };

    public updateUser = async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (await this.userService.editUser(_.params, _.body)) {
                return res.status(200).json({ message: 'success' });
            }
        } catch (e) {
            next(e);
        }
        return false;
    };

    public deleteUser = async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (await this.userService.removeUser(_.params)) {
                return res.status(200).json({ message: 'success' });
            }
        } catch (e) {
            next(e);
        }
        return false;
    };
}
