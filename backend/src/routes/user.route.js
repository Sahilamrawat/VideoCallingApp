import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getFriendRequest, getmyFriends, getOutgoingFriendRequest, getRecommendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

const router = express.Router();


router.use(protectRoute);// use the auth middleware for all routes

router.get('/',getRecommendedUsers);
router.get('/friends',getmyFriends);
router.post('/friend-request/:id',sendFriendRequest);
router.put('/friend-request/:id/accept',acceptFriendRequest);
router.get('/friend-requests',getFriendRequest);

router.get('/outgoing-friend-requests',getOutgoingFriendRequest);
export default router;