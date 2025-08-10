// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    hoTen: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    soDienThoai: {
        type: String,
        required: true,
        trim: true
    },
    chucVu: {
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
employeeSchema.pre('findOneAndUpdate', function() {
    this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Employee', employeeSchema);