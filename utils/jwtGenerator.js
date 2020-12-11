const jwt = require('jsonwebtoken')
const { user } = require('pg/lib/defaults')
require('dotenv').config()

function jwtgenerator(user_id) {
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" })
}

module.exports = jwtgenerator