import ApiConfig from "@/config/config";

class DocumentEndpoints{
    private constructor(){}

    static doclist(userId: string): string {
        return `${ApiConfig.BASE_URL}/${userId}/docs/`;
    }

    static docDetail(userId: string, docId: string): string {
        return `${ApiConfig.BASE_URL}/${userId}/docs/${docId}/`;
    }
};

export default DocumentEndpoints;
