import express from 'express';
const router = express.Router();
import { getPosts, getPost, createPost, updatePost, deletePost } from "../controllers/postController.js";
import { verifyToken } from '../middleware/verifyToken.js';

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);


export default router;