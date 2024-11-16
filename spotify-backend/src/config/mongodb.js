import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI; // Ensure MONGODB_URI includes the database name
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }

        console.log("Connecting to MongoDB with URI:", uri);

        // Connect to MongoDB
        await mongoose.connect(uri);

        mongoose.connection.on('connected', () => {
            console.log("MongoDB connection established successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;