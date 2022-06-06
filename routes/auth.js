const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "keepItHighly$ecure";    //jwt secret sign

//ROUTE:1-------- create a user using: POST "/api/auth/createuser". Doesn't require login
router.post('/createuser', [
    body('name', 'name must be at least 3 characters long').isLength({ min: 3 }),
    body('email', 'enter valid email address').isEmail(),
    body('password', "password must be longer than 4 characters").isLength({ min: 5 })
],
    async (req, res) => {
        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //check whether the user with this email id already exists 
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "user with this email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            //create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            //data to be sent in the auth token below
            const paylod = {
                user: {
                    id: user.id
                }
            }
            //creating authorization token
            const authToken = jwt.sign(paylod, JWT_SECRET);
            res.json({ authToken });
        } catch (error) {
            console.error(error.message);
            res.status(400).send("internal server occured");
        }
    })


//ROUTE:2----------authenticate an user using: POST endpoint- "api/auth/login", No login required
router.post('/login', [
    body('email', 'enter valid email address').isEmail(),
    body('password', "enter password").exists()
], async (req, res) => {
    //if errors are there return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    //otherwise go ahead
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "incorrect credentials" });

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ error: "incorrect credentials" })
        }
        const paylod = {
            user: {
                id: user.id
            }
        }
        //jwt
        const authToken = jwt.sign(paylod, JWT_SECRET);
        res.json(authToken);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})


//ROUTE:3--------------get logged in user details using POST "api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});


module.exports = router;