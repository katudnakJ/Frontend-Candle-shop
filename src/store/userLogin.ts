import { LineProfileResponse, UserLoginResponse } from "@/modules/auth/userLogin.type"
import { Status } from "@/types/response.type"
import { apiClient } from "@/utils/api"
import { create } from "zustand"

const initialState = {
    userData : null,
    isLoading : true,
    isLoggedIn : false
}

type UseAuthStoreUserLogin = {
//  State
    userData : LineProfileResponse | null
    isLoading: boolean
    isLoggedIn : boolean

//  Methods
    login : (lineToken : string) => void
    logout : () => void
    getUserData : () => LineProfileResponse | null
}

export const useAuthStoreUserLogin = create<UseAuthStoreUserLogin>((set, get) => ({
    ...initialState,
    login : async (lineToken : string) => {
            set({isLoading : true});
            
            const response = await apiClient.post<UserLoginResponse>("/v1/login",{},{
                headers: {
                    'Authorization': `Bearer ${lineToken}`
                }
            })
            
            set({
                userData: response.data.lineProfile,
                isLoading: false,
                isLoggedIn: true
            })
                
    },
    logout : async () => {
        await apiClient.post<Status>("/v1/logout");
        set({
            userData: null,
            isLoading: false,
            isLoggedIn: false
        })
    },
    getUserData : () => {
        return get().userData;
    },
}))
