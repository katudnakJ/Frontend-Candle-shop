
export interface LineProfileResponse {
    displayName : string
    pictureUrl : string
}

export interface UserLoginResponse {
    userId : string
    userRole : string
    owner : boolean
    lineProfile : LineProfileResponse
}