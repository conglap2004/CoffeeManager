// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    ten: {
        type: String,
        required: true,
        trim: true
    },
    sdt: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    diaChi: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware để cập nhật updatedAt khi document được update
customerSchema.pre('findOneAndUpdate', function() {
    this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Customer', customerSchema);