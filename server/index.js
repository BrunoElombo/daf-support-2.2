require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");

const app = express();

const corsOptions = {
    origin: "*"
}

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("Entity API");
});

app.use("/users", userRoutes);
app.use("/api", authRoutes);
app.use("/employees", employeeRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on http://localhost:${process.env.PORT}`)
})