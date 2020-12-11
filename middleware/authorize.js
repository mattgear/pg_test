const jwt = require('jsonwebtoken')
require("dotenv").config()

function authorize (req, res, next) {
    // destructure token
    const jwtToken = req.header("token")
    if (!jwtToken) {
        return res.status(403).send("You're not authorized")
    }

    try {
        const verify = jwt.verify(jwtToken, process.env.jwtSecret)
        req.user = verify.user
        next()
    } catch (err) {
        console.error(err.message)
        return res.status(403).send("You're not authorized")
    }
}

module.exports = authorize