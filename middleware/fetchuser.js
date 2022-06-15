var jwt = require('jsonwebtoken');
const JWT_SECRET = "keepItHighly$ecure";

const fetchuser = async (req, res, next) => {
    //get the user from jwt token and id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "invalid jwt" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = await data.user;
    } catch (error) {
        res.status(401).send({ error: "invalid jwt" });
    }

    next();
}


module.exports = fetchuser;
