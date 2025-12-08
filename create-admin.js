require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('./models/user-model');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to DB...");

        const email = 'admin@bunnyhop.com';
        const password = 'admin'; // Simple password for them
        const username = 'admin';

        // Check if exists
        let user = await userModel.findOne({ email });

        if (user) {
            console.log("Admin user already exists. Updating permissions...");
            user.isSeller = true;
            await user.save();
        } else {
            console.log("Creating new admin user...");
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            user = await userModel.create({
                fullName: 'Admin User',
                email,
                username,
                password: hash,
                isSeller: true
            });
        }

        console.log(`✅ Admin Creds Ready:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);

    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
