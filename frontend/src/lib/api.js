import { axiosInstance } from "./axios";

export const signup=async (signupData) =>{
    const res=await axiosInstance.post("/auth/signup",signupData);
    return res.data;

}
export const login=async (loginData) =>{
    const res=await axiosInstance.post("/auth/login",loginData);
    return res.data;

}
export const logout=async () =>{
    const res=await axiosInstance.post("/auth/logout");
    return res.data;
    
}


export const getAuthUser =async()=>{
    try {
        
        const res= await axiosInstance.get("auth/me")
        
        return res.data;
    } catch (error) {
        console.log("Error in getting auth user",error);
        return null;
    }
}

export const completeOnboarding = async (onboardingData) => {
    const res=await axiosInstance.post("/auth/onboarding",onboardingData);
}