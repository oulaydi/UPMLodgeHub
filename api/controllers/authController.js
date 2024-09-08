import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    const { username, email, phone, password } = req.body;

    try {
        // Hash pwd
        const hashedPassword = await bcrypt.hashSync(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                phone,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "Utilisateur créé" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        
        if (!user) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrects" });
        }
        
        // check user password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrects" });
        }

        // create coookie token and send it back
        const age = 1000 * 60 * 60 * 24 * 7; // 1 week

        // create token and send it back
        const token = jwt.sign(
            { id: user.id, username: user.username, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: age }
        );

        const { password: userPWD, ...userInfo } = user;

        res.cookie("token", token , {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
            maxAge: age,
        }).status(200).json(userInfo);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Échec de la connexion" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Déconnecté" });
};
