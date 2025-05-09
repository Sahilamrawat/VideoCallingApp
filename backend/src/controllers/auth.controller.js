import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export async function signup(req,res){
    const{
        fullName,
        email,
        password, 
    }=req.body;
    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password should be at least 6 characters"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Please enter a valid email"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists, Please use Different Email"});
        }
        const idx=Math.floor(Math.random()*100)+1; //generate a random number between 1 and 100
        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser=await User.create({
            fullName,
            email,
            password,
            profilePic:randomAvatar,
        })
        // TODO: create the user in the STREAM as well
        try{
            await upsertStreamUser({
                id:newUser._id.toString(),
                name:newUser.fullName,
                image:newUser.profilePic,
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        }catch(err){
            console.log("Error in creating stream user",err);
        }






        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, //prevent XSS attacks    
            sameSite:"strict",//prevent CSRF attacks
            secure:process.env.NODE_ENV==="production" //only send cookie over https
        })
        res.status(201).json({success:true,user:newUser})
    }catch(err){
        console.log("Error in signup",err);
        return res.status(500).json({message:"Internal Server Error"});
    }
    
};
export async function login(req,res){
    const{
        email,
        password,
    }=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid Email or Password"});
        }
        const isPasswordCorrect=await user.matchPassword(password);  
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid Email or Password"});
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, //prevent XSS attacks    
            sameSite:"strict",//prevent CSRF attacks
            secure:process.env.NODE_ENV==="production" //only send cookie over https
        })
        res.status(200).json({success:true,user})

    }catch(err){
        console.log("Error in login",err);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

export async function logout(req,res){
    res.clearCookie("jwt")
    res.status(200).json({success:true,message:"User logged out successfully"});
}
export async function onBoarding(req,res){
    try {
        const userId=req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location}=req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message:"Please fill all the fields",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ]
            });
        }
        const updatedUser=await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true,
        },{new:true});
        if(!updatedUser){
            res.status(400).json({message:"User not found"});
        }

        try{
            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullName,
                image:updatedUser.profilePic || "",
            })
            console.log(`Stream user updated for ${updatedUser.fullName}`);
        }catch(err){
            console.log("Error in updating stream user",err.message);
        }

        res.status(200).json({success:true,updatedUser});


    } catch (error) {
        console.log("Error in onBoarding",error);
        return res.status(500).json({message:"Internal Server Error"});
        
    }
}


