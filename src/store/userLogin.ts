import { UserLoginResponse } from "@/modules/auth/userLogin.type"
import { useAuthService } from "@/services/useAuthLogin"
import { Status } from "@/types/response.type"
import { apiClient } from "@/utils/api"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const initialState = {
    userData : null,
    isLoading : true,
    isLoggedIn : false
}

type UseAuthStoreUserLogin = {
//  State
    userData : UserLoginResponse | null
    isLoading: boolean
    isLoggedIn : boolean

//  Methods
    setLoading: (loading: boolean) => void
    login : (response : UserLoginResponse) => void
    logout : () => void
    getUserData : () => UserLoginResponse | null
}

export const useAuthStoreUserLogin = create<UseAuthStoreUserLogin>() (
persist(
    (set, get) => ({
      ...initialState,

        setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },


    login : async (response : UserLoginResponse) => {
            
            set({
                userData: response,
                isLoading: false,
                isLoggedIn: true
            });
                
    },
    logout : async () => {
        set({isLoading : true});        
        await apiClient.post<Status>("/v1/logout");
        set({
            userData: null,
            isLoading: false,
            isLoggedIn: false
        });
    },
    getUserData: () => get().userData,
}),
{
      name: 'auth-storage', // ชื่อ key ใน localStorage
      storage: createJSONStorage(() => localStorage),
    }
));
