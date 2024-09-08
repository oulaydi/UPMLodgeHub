import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
    res.status(200).json({ message: "Vous êtes connecté !" });
};

export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Non autorisé" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide!" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: "Vous n'êtes pas un administrateur!" });
        }

        res.status(200).json({ message: "Vous êtes connecté !" });
    });
};