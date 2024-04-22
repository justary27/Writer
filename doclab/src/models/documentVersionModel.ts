import User from "./userModel";
import Document from "./documentModel";

export interface DocumentVersion {
    id: string;
    document: Document;
    user: User;
    content: string;
    timestamp: string; // Change to appropriate date format if needed
};

export default DocumentVersion;
