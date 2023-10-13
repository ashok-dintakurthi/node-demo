const Users = require('../models/User');
const { processRequestBody } = require('../services/requestBody');
const _ = require('lodash')
const { validateToken } = require('../services/common');
const superAdmin = 'superadmin';

exports.addUpdateAdminUser = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        if (userInfo.role !== superAdmin) { return res.status(400).send({ message: 'Sorry, You dont have access' }); }
        if (!req.body.userId) { // Create Admin/User
            let fieldsArray = ["email", "name", "password", "role", "feedCategory"];
            let data = await processRequestBody(req.body, fieldsArray);
            console.log('data  ', req.body)
            if (data.missingFields && data.missingFields.length) { res.send({ message: `Required Fields missing: ${data.missingFields.join(', ')}` }) }
            data = req.body;
            // check emailId is exist or not
            let filter = { "email": data.email.toLowerCase(), isDeleted: false, role: 'admin' };
            let admin = await Users.findOne(filter);
            if (!_.isEmpty(admin) && (admin.email)) {   //if admin exist give error
                return res.send({ message: 'Email already exists' });
            } else {
                console.log('data  ', data)
                if (!['admin', 'basic'].includes(data.role)) { return res.send({ message: 'Please send valid role' }) }
                data['email'] = data['email'].toLowerCase();
                // save new admin
                var newUser = await new Users(data).save();
                return res.send({ message: 'User saved successfully', data: newUser });
            }
        } else {    // Update the admin/user
            const filter = {}
            if (req.body.deleteAccess) { filter['deleteAccess'] = req.body.deleteAccess };
            if (req.body.feedCategory) { filter['feedCategory'] = req.body.feedCategory };
            if (req.body.addDeleteUsers) { filter['addDeleteUsers'] = req.body.addDeleteUsers };
            const updateAdminUser = await Users.findByIdAndUpdate(req.body.userId, filter);
            return res.send({ message: 'User updated successfully', data: updateAdminUser });
        }
    } catch (error) {
        console.log("error = ", error);
        res.send({ message: error });
    }
}

exports.adminUserListing = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        if (userInfo.role !== superAdmin) { return res.status(400).send({ message: 'Sorry, You dont have access' }); }
        const filter = { isDeleted: false, role: { $nin: ['superadmin'] } }
        const result = await Users.find(filter);
        return res.send(result);
    }
    catch (error) {
        console.log(error);
        return res.send({ message: error });
    }
}

exports.deleteAdminUsers = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        if (userInfo.role !== superAdmin) { return res.status(400).send({ message: 'Sorry, You dont have access' }); }
        let filter = { isDeleted: true };
        const deletedUser = await Users.findOneAndUpdate({ _id: req.params.id }, filter);
        return res.send({ message: ' User deleted successfully' });
    }
    catch (error) {
        console.log(error);
        return res.send({ message: error });
    }
}