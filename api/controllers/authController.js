import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash pwd
        const hashedPassword = await bcrypt.hashSync(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "User created" });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

export const login = (req, res) => {
    console.log("Logging in user");
};

export const logout = (req, res) => {
    console.log("Logging out user");
};
