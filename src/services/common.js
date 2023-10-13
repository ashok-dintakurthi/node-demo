const jwt = require('jsonwebtoken');
const Users = require('../models/User');

async function validateToken(headers) {
    if (!headers.authorization) { return ({ status: 400, message: "Please send authorization token" }) }

    let decoded = jwt.decode(headers.authorization);
    console.log('decoded isss  ', decoded)
    if (!decoded) { return ({ status: 400, message: "Invalid token" }); }
    let userId = decoded._id
    let filter = { _id: userId, isDeleted: false }
    const user = await Users.findOne(filter);
    console.log('user isss ', user);
    if (!user) { return ({ status: 400, message: "User not found" }); }
    return user;
}

module.exports = { validateToken }