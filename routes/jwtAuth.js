const bcrypt = require('bcrypt')
const { PRIORITY_LOW } = require('constants')
const router = require('express').Router()
const pool = require("../db")

const jwtGenerator = require("../utils/jwtGenerator")
const validate = require("../middleware/validateInfo")
const authorize = require("../middleware/authorize")

// sign up
router.post("/register", validate, async(req, res) => {
    // destructure query
    const { email, name, password } = req.body

    try {
        // check user exists
        const user = await pool.query({
            text: "SELECT * FROM test.users where user_email = $1",
            values: [ email ]
        })

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exists")
        }

        // hash pass
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPass = await bcrypt.hash(password, salt)

        // enter user into DB
        const newUser = await pool.query({
            text: "INSERT INTO test.users(user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            values: [name, email, bcryptPass]
        })

        // generate JWT token
        const jwtToken = jwtGenerator(newUser.rows[0].user_id)
        
        return res.json({ jwtToken })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
})

// login 
router.post("/login", validate, async(req, res) => {
    try {
        // destructure
        const { email, password } = req.body

        // check if user exists
        const user = await pool.query("SELECT user_email, user_password from test.users where user_email = $1", [email])
        if (user.rows.length !== 1) {
            return res.status(401).send("Email already exists")
        }

        // check if user and password match
        const validPass = await bcrypt.compare(password, user.rows[0].user_password)
        if (!validPass) {
            return res.status(401).send("Password/ email is incorrect")
        }

        // generate jwt token
        const jwtToken = jwtGenerator(user.rows[0].user_id)
        return res.json({ jwtToken })

    } catch (err) {
        console.error(err.message)
    }
})

// check if token is valid
router.get("/verify", authorize, async(req, res) => {
    try {
        res.json(true)
    } catch (err) {
        console.error(err)
        return res.status(403).send("Not authorized")
    }
})

module.exports = router