var express = require("express");
var router = express.Router();
const perfumeController = require("../controllers/perfumeController");
/* GET home page. */
router.get("/", perfumeController.getAllPerfumeViews);

module.exports = router;
