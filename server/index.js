require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");
const entitiesRoutes = require("./routes/entities");
const sitesRoutes = require("./routes/site");
const productRoutes = require("./routes/product");
const bankRoutes = require("./routes/bank");

const app = express();

// const ipAddress = '172.19.120.187';

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

app.use("/api", authRoutes);
app.use("/users", userRoutes);
app.use("/employees", employeeRoutes);
app.use("/entities",entitiesRoutes);
app.use("/sites",sitesRoutes);
app.use("/products", productRoutes);
app.use("/banks", bankRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on http://127.0.0.1:${process.env.PORT}`)
})