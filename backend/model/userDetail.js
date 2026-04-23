import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    names: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address"
        ]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    nationality: {
        type: String,
        required: [true, "Nationality is required"],
        trim: true,
        minlength: [2, "Nationality must be at least 2 characters long"],
        maxlength: [50, "Nationality cannot exceed 50 characters"]
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        minlength: [2, "City must be at least 2 characters long"],
        maxlength: [50, "City cannot exceed 50 characters"]
    },
    course: {
        type: String,
        required: [true, "Course is required"],
        trim: true,
        minlength: [2, "Course must be at least 2 characters long"],
        maxlength: [100, "Course cannot exceed 100 characters"]
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [13, "Age must be at least 13"],
        max: [120, "Age cannot exceed 120"]
    }
}, {
    timestamps: true, 
    versionKey: false 
});


// userSchema.index({ email: 1 });


const User = mongoose.model("User", userSchema);

export default User;