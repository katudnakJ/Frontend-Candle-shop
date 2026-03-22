
export interface LineProfileResponse {
    displayName : string
    pictureUrl : string
}

export interface UserLoginResponse {
    userId : string
    userRole : string
    isOwner : boolean
    lineProfile : LineProfileResponse
}