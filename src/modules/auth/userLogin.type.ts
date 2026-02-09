import { Status } from "@/types/response.type";

export interface LineProfileResponse {
    displayName : string
    pictureUrl : string
}

export interface UserLoginResponse {
    userId : string
    userRole : string
    lineProfile : LineProfileResponse
    status : Status
}