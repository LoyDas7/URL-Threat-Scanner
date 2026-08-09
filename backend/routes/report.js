const express = require("express");

const router = express.Router();

const { downloadReport } = require("../controllers/reportController");

router.get("/:fileName", downloadReport);

module.exports = router;