import ApiConfig from "@/config/config";

class UserEndpoints{
    private constructor(){}

    static readonly login = `${ApiConfig.BASE_URL}/login/`;

    static readonly signup = `${ApiConfig.BASE_URL}/signup/`;

};

export default UserEndpoints;
