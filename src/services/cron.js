const cron = require('node-cron');
const fs = require('fs');

async function scheduleCronJobs() {
    cron.schedule('*/30 * * * *', async () => {
        try {
            console.log("Delete the files which is older than 30 minutes");
            await fs.readFile(logFilePath, (err, data) => {
                if (err) { console.log('err while reading file ', err); }
                console.log(data);
            });
            return;
        } catch (error) {
            console.log('error in cron', error);
            return;
        }
    });
}

module.exports = { scheduleCronJobs }
