const express = require("express");
const router = express.Router();

const { scanURL } = require("../controllers/scanController");

router.post("/", scanURL);

module.exports = router;