function validate (req, res, next) {
    const { email, name, password } = req.body

    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === "/register") {
        if (![email, name, password].every(Boolean)) {
            return res.json("Missing credentials")
        } else if (!validEmail(email)) {
            return res.json("Invalid email")
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.json("Missing credentails")
        } 
    }

    next()
}

module.exports = validate