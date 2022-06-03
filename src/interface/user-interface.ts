export interface INewUserRequestData {
    firstName: string;
    lastName: string;
    address: string;
    isActive: boolean;
}

export interface IQueryUser {
    limit: number;
    offset: number;
}
