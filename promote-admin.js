require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('./models/user-model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to DB...");

        // REPLACE THIS WITH YOUR GOOGLE EMAIL
        const emailToPromote = process.argv[2];

        if (!emailToPromote) {
            console.error("Please provide an email address as an argument.");
            console.log("Usage: node promote-admin.js <your_email>");
            process.exit(1);
        }

        const user = await userModel.findOne({ email: emailToPromote });

        if (!user) {
            console.error(`User with email ${emailToPromote} not found.`);
            process.exit(1);
        }

        user.isSeller = true;
        await user.save();

        console.log(`✅ Success! User ${user.email} is now an Admin/Seller.`);
        console.log("You can now access the dashboard at /seller/dashboard or via the UI.");
        process.exit(0);

    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
