import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query);

    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,

                price: {
                    gte: parseInt(query.minPrice) || undefined,
                    lte: parseInt(query.maxPrice) || undefined,
                },
            },
        });

        // setTimeout(() => {
            res.status(200).json(posts);
        // }, 3000);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error! can not get Posts" });
    }
};

export const getPost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });


        let userId;
        const token = req.cookies?.token;

        if(!token) {
            userId = null;
        } else {
            jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
                if(err) {
                    userId = null;
                } else {
                    userId = user.id;
                }
            });
        }

        const saved = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    postId: id,
                    userId
                }
            }
        })

        res.status(200).json({ ...post, isSaved: saved ? true : false });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error! can not get Post" });
    }
};

export const createPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                },
            },
        });

        res.status(200).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error! can not add Post" });
    }
};

export const updatePost = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error! can not update Post" });
    }
};

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (post.userId !== tokenUserId) {
            return res
                .status(403)
                .json({ message: "You are not allowed to delete this post" });
        }

        await prisma.post.delete({
            where: { id },
        });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error! can not delete Post" });
    }
};
