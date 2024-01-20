const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(" ")[1];

    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        try {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) return res.status(401).send("Access denied. Invalid token.");
                req.user = user;
                console.log("Authenticated")
                return next();
            })
        }
        catch (err) {
            return res.status(401).send(err);
        }

    }
    catch (err) {
        return res.status(401).send("Access denied. Invalid token.");
    }
}

const verifyUser = async (req, res, next) => {
    const { id } = req.user;
    try {
        const user = await Users.findById(id)
        if (user) {
            console.log('User Exists')
            return next()
        }
    }
    catch (err) {
        return res.status(401).send(err);
    }
}
module.exports = { verifyToken, verifyUser }