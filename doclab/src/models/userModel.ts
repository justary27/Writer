export interface User {
    id?: string;
    email: string;
    is_active: boolean;
    token?: string;
};

export default User;
