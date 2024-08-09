const adminModelGenerator = () => {
    const file = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
}, { timestamps: true });

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

AdminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    );
    return token;
}

AdminSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

AdminSchema.pre('findOneAndUpdate', async function (next) {
    if (!this._update.password) return next();

    const salt = await bcrypt.genSalt(10);
    this._update.password = await bcrypt.hash(this._update.password, salt);

    next();
});

module.exports = mongoose.model('Admin', AdminSchema);
    `

    return file
}

export default adminModelGenerator