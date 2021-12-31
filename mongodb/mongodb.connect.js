require('dotenv').config();
const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect(
            process.env.DB_CONN
            )
    } catch (err) {
        console.error("Error connecting to mongo db");
        console.error(err);
    }
}

module.exports = { connect};

