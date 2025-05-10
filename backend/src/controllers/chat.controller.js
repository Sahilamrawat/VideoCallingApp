import { generateStreamToken } from "../lib/stream.js";

export function getStreamToken(req,res){
    try {
        const token=generateStreamToken(req.user.id);
        if(!token){
            return res.status(400).json({message:"Token not found"});
        }
        res.status(200).json({token});
    } catch (error) {
        console.log("Error in getting stream token",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}