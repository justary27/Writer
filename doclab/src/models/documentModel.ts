import User from "./userModel";

interface Document{
    id?: string;
    title: string;
    content: string;
    created_at?: string;
    is_public?: boolean;
    owner: User;
    collaborators?: User[];
    public_link?: string;
};

export default Document;
