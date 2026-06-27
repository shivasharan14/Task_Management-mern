const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ msg: "No token provided" });
    }

    let token = req.headers.authorization;

    if (!token.startsWith("Bearer ")) {
        return res.status(401).send({ msg: "Not authorized" });
    }

    token = token.split(" ")[1];
    console.log(token)

    const decoded = jwt.decode(token, process.env.SECRET_KEY);
   console.log(decoded)
    req.user = {
        id: decoded.id,
        role: decoded.role
    };

    next();
}

function admin(req, res, next) {
    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(403).send({
            msg: "You are not authorized"
        });
    }
}

module.exports = { auth, admin };