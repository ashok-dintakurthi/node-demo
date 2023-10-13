const Users = require('../models/User');
const bcrypt = require('bcrypt');
const superAdminpassword = 'Adeodist@123'
async function addSuperAdmin() {
    try {
        let admin = await Users.findOne({ "email": "adeodist@grr.la" });
        let password = await ecryptPassword(superAdminpassword);
        if (!admin) {
            let data = {
                "name": "SuperAdmin",
                "email": "adeodist@grr.la",
                "password": password,
                "role": "superadmin",
                "feedCategory": ['basic', 'admin', 'superadmin'],
                "deleteAccess": ['basic', 'admin', 'superadmin'],
                "isDeleted": false,
                "addDeleteUsers": true
            };
            await new Users(data).save();
        }
        return;
    } catch (error) {
        console.log('error while seeding SuperAdmin Info ', error);
        return;
    }
}

async function ecryptPassword(password) {
    return new Promise(async (resolve, reject) => {
        try {
            if (password) {
                let encryptedPassword = bcrypt.hashSync(password, 10);
                return resolve(encryptedPassword);
            }
            return resolve();
        } catch (error) {
            console.log(' error while encrypting password ', error);
            return reject(error);
        }
    });
}

module.exports = { addSuperAdmin }