import { UserLoginResponse } from "@/modules/auth/userLogin.type";
import { Status } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";


export const useAuthService = () => {

    const useLogin = useMutation<UserLoginResponse, Status, string>({
    mutationKey: ["authLogin"],
    mutationFn: async (lineToken: string) => {
        const response = await apiClient.post<UserLoginResponse>("/v1/login", {}, {
            headers: {
                'Authorization': `Bearer ${lineToken}`
            }
        });
        
        return response.data ?? null;
    }
    });

    return {
        useLogin
    };
}