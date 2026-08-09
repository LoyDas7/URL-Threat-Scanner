const path = require("path");

function downloadReport(req, res) {

    const { fileName } = req.params;

    const filePath = path.join(__dirname, "../reports", fileName);

    res.download(filePath);

}

module.exports = {
    downloadReport
};