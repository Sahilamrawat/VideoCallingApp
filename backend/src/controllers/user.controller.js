import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req,res){
    try {
        const currentUserId=req.user._id;
        const currentUser=req.user;

        const recommendedUsers=await User.find({
            $and: [
                {_id:{$ne:currentUserId}}, // not the current user
                {_id:{$nin:currentUser.friends}},//exclude current user's friends
                {isOnboarded:true}, // only onboarded users
            ]
        }) 
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log("Error in getting recommended users",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getmyFriends(req,res){
    try {
        const user=await User.findById(req.user._id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage location");
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getting friends",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function sendFriendRequest(req,res){
    try {
        const myId=req.user._id;
        const { id:recipientId }=req.params;

        // prevent sending requests to self

        if(myId===recipientId){
            return res.status(400).json({message:"You cannot send friend request to yourself"});
        }
        const recipient=await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({message:"User not found"});
        }
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"});
        }
        //check if the request is already sent
        const existingRequest=await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ]
        });

        //check if req already exits
        if(existingRequest){
            return res.status(400).json({message:"Friend request already sent"});
        }


        const friendRequest=await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        });
        res.status(200).json({friendRequest});
    } catch (error) {
        console.log("Error in sending friend request",error);  
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export async function acceptFriendRequest(req,res){
    try {
        const { id:requestId }=req.params;
        const friendRequest=await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(400).json({message:"Friend request not found"});
        }

        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(400).json({message:"You are not the recipient of this request"});
        }
        friendRequest.status="accepted";
        await friendRequest.save();


        //add each user to other's friends list
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{
                friends:friendRequest.recipient
            }
        });

        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{
                friends:friendRequest.sender
            }
        });
        res.status(200).json({message:"Friend request accepted"});

    } catch (error) {
        console.log("Error in accepting friend request",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getFriendRequest(req,res){
    try {
        const IncomingRequests=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage location");

        const acceptedRequests=await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
        }).populate("recipient","fullName profilePic ");

        res.status(200).json({IncomingRequests,acceptedRequests});
    } catch (error) {
        console.log("Error in getting friend requests",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export async function getOutgoingFriendRequest(req,res){
    try {
        const outgoingRequests=await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage location");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in getting outgoing friend requests",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}