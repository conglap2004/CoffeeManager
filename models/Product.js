const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 1000
    },
    category: {
        type: String,
        required: true,
        enum: ['coffee', 'cacao', 'special', 'tea']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=No+Image'
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
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

// Middleware để cập nhật updatedAt khi save
productSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Product', productSchema);