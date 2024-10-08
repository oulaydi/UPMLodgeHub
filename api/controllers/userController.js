import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Erreur! Impossible d'obtenir les utilisateurs",
        });
    }
};

export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Erreur! Impossible d'obtenir l'utilisateur",
        });
    }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Non autorisé!" });
    }

    let updateedPassword = null;
    try {
        if (password) updateedPassword = await bcrypt.hash(password, 10);

        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updateedPassword && { password: updateedPassword }),
                ...(avatar && { avatar }),
            },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                phone: true,
                createdAt: true,
            },
        });

        res.status(200).json(updateUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Erreur! Impossible de mettre à jour l'utilisateur",
        });
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId)
        return res.status(403).json({ message: "Non autorisé!" });

    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Erreur! Impossible de supprimer l'utilisateur",
        });
    }
};

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                },
            });
            return res.status(200).json({ message: "Post retiré des favoris" });
        } else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                },
            });
            return res
                .status(200)
                .json({ message: "Post enregistré dans les favoris" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Erreur! Impossible de supprimer l'utilisateur",
        });
    }
};

export const profilePosts = async (req, res) => {
    const tokenUserId = req.params.userId;

    try {
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId },
        });

        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true,
            },
        });

        const savedPosts = saved.map((item) => item.post);

        res.status(200).json({ userPosts, savedPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Erreur! Impossible d'obtenir les posts",
        });
    }
};

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId],
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId],
                    },
                },
            },
        });
        res.status(200).json(number);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Échec de l'obtention des publications de profil !" });
    }
};
