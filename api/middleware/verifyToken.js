import jwt from "jsonwebtoken";

export const verifyToken =  (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token Not Valid!" });
        }

        req.userId = user.id;
        
        next();
    });
};