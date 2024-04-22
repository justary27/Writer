import User from "@/models/userModel";
import UserEndpoints from "../endpoints/userEndpoints";

class UserApiClient{
    private constructor(){}
    
    static async login(email: string, password: string): Promise<User> {
        try {
            const response = await fetch(UserEndpoints.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data =  await response.json();

            return data["data"] as Promise<User>;

        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    };

    static async signup(email: string, password: string): Promise<any>{
        try {
            const response = await fetch(UserEndpoints.signup, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch user data`);
            }

            const data =  await response.json();

            return data["data"] as Promise<User>;

        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
};

export default UserApiClient;
