const express = require('express')
const app = express()

// requests to json
app.use(express.json())

// Routes //
app.use("/auth", require("./routes/jwtAuth"))

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})