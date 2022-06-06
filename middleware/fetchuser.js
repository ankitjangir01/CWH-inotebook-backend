var jwt = require('jsonwebtoken');
const JWT_SECRET = "keepItHighly$ecure";

const fetchuser = (req, res, next) => {
    //get the user from jwt token and id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authinticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
    } catch (error) {
        res.status(401).send({ error: "please authinticate using a valid token" });
    }

    next();
}


module.exports = fetchuser;
