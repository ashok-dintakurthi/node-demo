const Users = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { validateToken } = require('../services/common');
const { addLogs } = require('../services/file');

exports.register = async (req, res) => {
  try {
    const userInfo = await validateToken(req.headers);
    if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
    if (!userInfo.addDeleteUsers) { return res.status(400).send({ message: 'Sorry, You dont have access to create a user' }); }
    let { name, password, email } = req.body;
    let user = {}, role = 'basic';
    email = email.toLowerCase();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const fetchUser = await Users.findOne({ email });
    if (fetchUser) { return res.send({ message: 'User already exists' }) };

    user = await new Users({ name, password, email, role }).save();
    /************************** CREATING LOGS IF THE ADMIN CREATES ANY USER **************************/
    const logData = {
      from: userInfo.name,
      to: name,
      message: ' created by ',
      timestamp: new Date().toISOString(),
      operation: 'User Created'
    }
    addLogs(logData);
    /************************************************** UPTO HERE **************************************************/

    return res.send({ message: 'User registered successfully' });
  } catch (error) {
    console.log('error isss   ', error)
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) return res.status(400).send({ message: 'User not found' });
    const accessToken = await jwt.sign({ _id: user._id }, config.jwtSecret);
    const updatedUser = await Users.findByIdAndUpdate(user._id, { $set: { accessToken: accessToken } });
    return res.send({ accessToken, _id: updatedUser._id });
  } catch (error) {
    console.log('error  ', error);
    res.status(400).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userInfo = await validateToken(req.headers);
    if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
    if (!userInfo.addDeleteUsers) { return res.status(400).send({ message: 'Sorry, You dont have access to delete a user' }); }
    const deleteFilter = { _id: req.params.id, role: 'basic' };
    const deleteUser = await Users.findByIdAndUpdate(deleteFilter, { isDeleted: true });
    /************************** CREATING LOGS IF THE ADMIN DELETES ANY USER **************************/
    const logData = {
      from: userInfo.name,
      to: deleteUser.name,
      message: ' deleted by ',
      timestamp: new Date().toISOString(),
      operation: 'User Deleted'
    }
    addLogs(logData);
    /************************************************** UPTO HERE **************************************************/
    return res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.log('error in profile  ', error)
    res.status(400).send(error);
  }
};
