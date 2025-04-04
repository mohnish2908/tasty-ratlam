const mongoose = require("mongoose");

exports.connect = async () => {
    try {
        const mongoURL = process.env.MONGODB_URL;
        if (!mongoURL) {
            console.error("❌ MongoDB URI is not defined in environment variables");
            process.exit(1);
        }

        await mongoose.connect(mongoURL, {
            maxPoolSize: 20,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 5000, // Timeout if server is unreachable
            socketTimeoutMS: 45000, // Prevent connection dropouts
        });

        console.log("✅ Database connected successfully");

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
            setTimeout(() => mongoose.connect(mongoURL), 5000);
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        // Keep connection alive
        setInterval(async () => {
            try {
                await mongoose.connection.db.admin().ping();
                console.log("✅ MongoDB connection is alive");
            } catch (err) {
                console.error("❌ MongoDB ping failed:", err);
            }
        }, 30000);

    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
