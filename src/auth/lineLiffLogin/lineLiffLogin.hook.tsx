"use client";

import liff from '@line/liff';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LineLiffUserProfileResp {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
}

const useLiffLogin = () => {

    const router = useRouter();

    const [lineProfile, setLineProfile] = useState<LineLiffUserProfileResp | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    let liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;
    console.log("liffId", liffId);
    

    const initializeLiff = async () => {
            try {
                await liff.init({liffId});
                if ( liff.isLoggedIn() ) {
                    setIsLoading(false)
                    const userProfile = await liff.getProfile();
                    setLineProfile({
                        userId: userProfile.userId,
                        displayName: userProfile.displayName,
                        pictureUrl: userProfile.pictureUrl,
                        statusMessage: userProfile.statusMessage,
                    } as LineLiffUserProfileResp);
                }else{
                    liff.login();
                }
            }catch (err) {
                console.log("LIFF initialization failed : ",err);
                setError("ไม่สามารถเชื่อมต่อกับ LIFF ได้" as unknown as Error);
            }
        }

    useEffect(()=>{
        initializeLiff();
    },[liff.isLoggedIn()]);

    const login = () => {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    }

    const logout = () => {
        if (liff.isLoggedIn()) {
            liff.logout();
            setLineProfile(null);
            router.refresh();
        }
    }

    return {
        lineProfile,
        isLoading,
        error,
        login,
        logout,
    };
}
export default useLiffLogin;