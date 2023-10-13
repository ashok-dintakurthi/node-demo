const Feed = require('../models/Feed');
const Users = require('../models/User');
const { processRequestBody } = require('../services/requestBody');
const mockFeedData = require('../utils/feeds');
const _ = require('lodash')
const superAdmin = 'superadmin';
const categoryList = ['admin', 'basic'];
const { validateToken } = require('../services/common');
const { addLogs } = require('../services/file');

exports.feedAccessToAdmin = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        if (userInfo.role !== superAdmin) { return res.status(400).send({ message: 'Sorry, You dont have access' }); }
        let fieldsArray = ["userId", "feedId"];
        let data = await processRequestBody(req.body, fieldsArray);
        if (data.missingFields && data.missingFields.length) { return res.send({ message: `Required Fields missing: ${data.missingFields.join(', ')}` }) }
        data = req.body;
        // check feed is exist or not
        const feedInfo = await Feed.findById(data.feedId);
        if (!feedInfo) { return res.send({ message: 'Feed does not exists' }) };
        const userDetails = await Users.findOne({ _id: data.userId });
        if (!userDetails) { return res.send({ message: 'User does not exists' }) };
        let filter = { $addToSet: { feedCategory: feedInfo.category } };
        const updateUserAccess = await Users.findByIdAndUpdate(data.userId, filter);
        if (req.body.isDeleteAccess) {
            let filterForDeleteAccess = { $addToSet: { deleteAccess: feedInfo.category } };
            await Users.findByIdAndUpdate(data.userId, filterForDeleteAccess);
        }
        return res.send({ message: 'Access to feed is successfully updated to the user ' });
    } catch (error) {
        console.log("error = ", error);
        return res.send({ message: error });
    }
}

exports.deleteFeed = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        //  Find Feed
        const feedInfo = await Feed.findById(req.params.id);
        if (!feedInfo) { return res.send({ message: 'Feed does not exists' }); }
        if (!userInfo.deleteAccess.includes(feedInfo.category)) { return res.send({ message: ' You dont have access to delete the feed' }) }
        // Update Feed status to delete
        const deleteFeeds = await Feed.findByIdAndUpdate(req.params.id, { $set: { isDeleted: true } })

        /************************** CREATING LOGS IF THE ADMIN DELETES ANY FEED **************************/
        const logData = {
            from: userInfo.name,
            to: feedInfo.name,
            message: ' deleted by ',
            timestamp: new Date().toISOString(),
            operation: 'Feed Deleted'
        }
        addLogs(logData);
        /************************************************** UPTO HERE **************************************************/
        return res.send({ message: 'Feed deleted successfully' });
    } catch (error) {
        console.log("error = ", error);
        return res.send({ message: error });
    }
}

exports.addFeed = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        if (userInfo.role !== superAdmin) { return res.status(400).send({ message: 'Sorry, You dont have access' }); }
        let fieldsArray = ["name", "url", "description", "category"];
        let data = await processRequestBody(req.body, fieldsArray);
        console.log('data  ', req.body)
        if (data.missingFields && data.missingFields.length) { return res.send({ message: `Required Fields missing: ${data.missingFields.join(', ')}` }) }
        data = req.body;
        // check emailId is exist or not
        let filter = { "$or": [{ "name": req.body.name.toLowerCase() }] }
        let feed = await Feed.findOne(filter);
        // if feed exist give error
        if (!_.isEmpty(feed) && (feed.name)) {
            return res.send({ message: 'Feed already exists' });
        } else {
            console.log('data  ', data);
            const newFeed = await new Feed(data).save();
            return res.send({ message: 'Feed saved successfully', data: newFeed });
        }
    } catch (error) {
        console.log("error = ", error);
        return res.send({ message: error });
    }
}
// Gives the list of Feeds where the User/Admin has access
exports.feedListing = async (req, res) => {
    try {
        const userInfo = await validateToken(req.headers);
        if (userInfo.status == 400) { return res.status(400).send({ message: userInfo.message }); }
        let filter = { category: { $in: userInfo.feedCategory }, isDeleted: false };
        const result = await Feed.find(filter);
        return res.send(result);
    }
    catch (error) {
        console.log(error);
        return res.send({ message: error });
    }
}
