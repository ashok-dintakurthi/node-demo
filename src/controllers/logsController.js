const fs = require('fs');
const path = require('path');
const { validateToken } = require('../services/common');
const superAdmin = 'superadmin';
const fileName = 'logs.txt'
let logFilePath = path.join(__dirname, '..', 'utils', fileName);

exports.getLogs = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        if (userInfo.role !== superAdmin) { return res.status(400).send({ message: 'Sorry, only Super Admin can view the logs' }); }
        await fs.readFile(logFilePath, (err, data) => {
            if (err) throw err;
            const fileContent = data.toString('utf-8');
            return res.send({ message: ' File read successfully ', fileData: fileContent })
        });
    } catch (error) {
        console.log("error = ", error);
        return res.send({ message: error });
    }
}