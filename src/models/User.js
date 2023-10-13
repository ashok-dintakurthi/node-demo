const mongoose = require('mongoose');
var schema = mongoose.Schema;

const userSchema = new schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['basic', 'admin', 'superadmin'] },
    email: { type: String, required: true, unique: true },
    feedCategory: { type: [String], enum: ['basic', 'admin', 'superadmin'] },   // User/Admin Access to view the feeds 
    deleteAccess: { type: [String], enum: ['basic', 'admin', 'superadmin'] },  // User/Admin Access to delete the feeds 
    accessToken: { type: String },
    isDeleted: { type: Boolean, default: false },
    addDeleteUsers: { type: Boolean, default: false }   // Admin access to create/delete the Users
}, { timestamps: true }
);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
