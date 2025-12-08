require('dotenv').config();
const mongoose = require('mongoose');

console.log("Testing MongoDB Connection...");
console.log("URI:", process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Log masked URI

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Connection Failed:");
        console.error(err);
        process.exit(1);
    });
