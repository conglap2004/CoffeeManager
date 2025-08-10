const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    maDanhMuc: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tenDanhMuc: {
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

// Middleware để tự động cập nhật updatedAt khi save
categorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Category', categorySchema);