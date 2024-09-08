import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur ! Impossible d'obtenir les utilisateurs" });
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
        res.status(500).json({ message: "Erreur ! Impossible d'obtenir l'utilisateur" });
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
        res.status(500).json({ message: "Erreur ! Impossible de mettre à jour l'utilisateur" });
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if(id !== tokenUserId) return res.status(403).json({ message: "Non autorisé!" });

    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur ! Impossible de supprimer l'utilisateur" });
    }
};
