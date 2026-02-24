const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, enum: ['admin', 'analyst', 'viewer'], default: 'viewer' },
    permissions: {
        canExecuteQueries: { type: Boolean, default: true },
        canModifyData: { type: Boolean, default: false },
        canDeleteData: { type: Boolean, default: false },
        canViewAnalytics: { type: Boolean, default: true },
        maxQueriesPerHour: { type: Number, default: 100 },
    },
    queryHistory: [{
        query: String,
        collection: String,
        timestamp: { type: Date, default: Date.now },
        executionTime: Number,
        resultCount: Number,
    }],
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.methods.canPerformAction = function (action) {
    const rolePermissions = {
        admin: ['read', 'write', 'delete', 'analytics', 'manage'],
        analyst: ['read', 'write', 'analytics'],
        viewer: ['read'],
    };
    return rolePermissions[this.role]?.includes(action) || false;
};

module.exports = mongoose.model('User', userSchema);
