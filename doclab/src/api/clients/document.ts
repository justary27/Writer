import Document from "@/models/documentModel";
import DocumentEndpoints from "../endpoints/documentEndpoints";

class DocumentApiClient {
    private constructor() {}

    static async getDocs(userId: string, token: string): Promise<Document[]> {
        try {
            const response = await fetch(DocumentEndpoints.doclist(userId), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch doc list');
            }
            return response.json() as Promise<Document[]>;
        } catch (error) {
            console.error('Error fetching doc list:', error);
            throw error;
        }
    }

    static async createDoc(userId: string, doc: Document, token: string): Promise<Document> {
        try {
            const response = await fetch(DocumentEndpoints.doclist(userId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(doc),
            });
            if (!response.ok) {
                throw new Error('Failed to create doc');
            }
            return response.json() as Promise<Document>;
        } catch (error) {
            console.error('Error creating doc:', error);
            throw error;
        }
    }

    static async getDoc(userId: string, docId: string, token: string): Promise<Document> {
        try {
            const response = await fetch(DocumentEndpoints.docDetail(userId, docId), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch doc detail');
            }
            return response.json() as Promise<Document>;
        } catch (error) {
            console.error('Error fetching doc detail:', error);
            throw error;
        }
    }

    static async updateDoc(userId: string, docId: string, doc: Document, token: string): Promise<Document> {
        try {
            const response = await fetch(DocumentEndpoints.docDetail(userId, docId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(doc),
            });
            if (!response.ok) {
                throw new Error('Failed to update doc');
            }
            return response.json() as Promise<Document>;
        } catch (error) {
            console.error('Error updating doc:', error);
            throw error;
        }
    }

    static async deleteDoc(userId: string, docId: string, token: string): Promise<any> {
        try {
            const response = await fetch(DocumentEndpoints.docDetail(userId, docId), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete doc');
            }
            return response.json();
        } catch (error) {
            console.error('Error deleting doc:', error);
            throw error;
        }
    }

};

export default DocumentApiClient;
