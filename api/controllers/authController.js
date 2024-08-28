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

        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
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
            return res.status(401).json({ message: "Invalid Infos" });
        }
        
        // check user password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Infos" });
        }

        // create coookie token and send it back
        const age = 1000 * 60 * 60 * 24 * 7; // 1 week

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: age }
        );

        res.cookie("token", token , {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
            maxAge: age,
        }).status(200).json({ message: "Logged in" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Faild to logging in" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logged out" });
};
