async function processRequestBody(body, fieldsArray) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {}, missingFields = [];
            fieldsArray.forEach(field => {
                // field in body && typeof body[field] != "undefined" ? data[field] = typeof body[field] === 'string' ? body[field].trim() : body[field] : delete data[field]
                if (!Object.keys(body).includes(field)) { missingFields.push(field) }
            });
            return resolve({ data, missingFields });
        } catch (error) {
            return reject({ status: 0, message: error });
        }
    });
}
module.exports = { processRequestBody }