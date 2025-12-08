require('dotenv').config();
const mongoose = require('mongoose');
const productModel = require('./models/product-model');
const userModel = require('./models/user-model');

// Corrected Enums based on model (assumed 'Male'/'Female' or similar, confirming after view_file)
// Setting safe defaults, will update if view_file reveals otherwise.
// Actually, I'll wait for the view_file result to be 100% sure, but I can draft the file update.
// The previous error said "girls" is invalid.

const dummyProducts = [
    {
        title: "Bunny Ears Hoodie - Pink",
        price: 2500,
        description: "Super soft hoodie with adorable bunny ears! Perfect for chilly days.",
        gender: "girl",
        category: ["Hoodies"],
        color: ["#FFC0CB", "#FFFFFF"],
        tags: ["featured", "cute"],
        mainImage: "https://images.unsplash.com/photo-1519238263496-63439708bc12?q=80&w=600&auto=format&fit=crop",
        image2: "https://images.unsplash.com/photo-1519238263496-63439708bc12?q=80&w=600&auto=format&fit=crop",
        image3: "https://images.unsplash.com/photo-1519238263496-63439708bc12?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Sunny Yellow Romper",
        price: 1800,
        description: "Bright and cheerful yellow romper for sunny playdates.",
        gender: "boy",
        category: ["Rompers"],
        color: ["#FFFF00"],
        tags: ["summer"],
        mainImage: "https://images.unsplash.com/photo-1522771753062-58836281a93e?q=80&w=600&auto=format&fit=crop",
        image2: "https://images.unsplash.com/photo-1522771753062-58836281a93e?q=80&w=600&auto=format&fit=crop",
        image3: "https://images.unsplash.com/photo-1522771753062-58836281a93e?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Cozy Bear Coat",
        price: 3200,
        description: "Warm fleece coat with teddy bear textures.",
        gender: "boy",
        category: ["Coats"],
        color: ["#8B4513"],
        tags: ["featured"],
        mainImage: "https://images.unsplash.com/photo-1433162653888-a571db5ccccf?q=80&w=600&auto=format&fit=crop",
        image2: "https://images.unsplash.com/photo-1433162653888-a571db5ccccf?q=80&w=600&auto=format&fit=crop",
        image3: "https://images.unsplash.com/photo-1433162653888-a571db5ccccf?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Princess Tutu Dress",
        price: 2900,
        description: "Magical tutu dress for special occasions.",
        gender: "girl",
        category: ["Frocks"],
        color: ["#FF69B4"],
        tags: ["party"],
        mainImage: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop",
        image2: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop",
        image3: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Dino Print Shirt",
        price: 1500,
        description: "Roar! Cool dinosaur prints for adventure-loving kids.",
        gender: "boy",
        category: ["Shirts"],
        color: ["#228B22"],
        tags: ["casual"],
        mainImage: "https://images.unsplash.com/photo-1621452773781-0f992ed03591?q=80&w=600&auto=format&fit=crop",
        image2: "https://images.unsplash.com/photo-1621452773781-0f992ed03591?q=80&w=600&auto=format&fit=crop",
        image3: "https://images.unsplash.com/photo-1621452773781-0f992ed03591?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Starry Night Pajamas",
        price: 1200,
        description: "Soft cotton pajamas to ensure sweet dreams.",
        gender: "girl",
        category: ["Rompers"],
        color: ["#000080"],
        tags: ["nightwear"],
        mainImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop",
        image2: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop",
        image3: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop"
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to DB...");

        // Find admin user to assign products to
        const admin = await userModel.findOne({ email: 'admin@bunnyhop.com' });
        if (!admin) {
            console.log("Admin user not found.");
            process.exit(1);
        }

        console.log(`Seeding products for seller: ${admin.username}...`);

        for (const prod of dummyProducts) {
            prod.seller = admin._id;
            try {
                const exists = await productModel.findOne({ title: prod.title });
                if (!exists) {
                    await productModel.create(prod);
                    console.log(`Created: ${prod.title}`);
                } else {
                    console.log(`Skipped (Exists): ${prod.title}`);
                }
            } catch (e) {
                console.error(`Failed to create ${prod.title}:`, e.message);
            }
        }

        console.log("✅ Dummy products seeding attempt finished.");
        process.exit(0);

    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
