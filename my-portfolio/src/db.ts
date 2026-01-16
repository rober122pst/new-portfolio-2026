import Dexie from 'dexie';

export interface User {
    username: string;
}

export const db = new Dexie('rbxRegistry') as Dexie & {
    user: Dexie.Table<User, number>;
};
