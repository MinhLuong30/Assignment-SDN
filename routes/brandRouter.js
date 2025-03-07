const brandController = require("../controllers/brandController");
const express = require("express");
const { isAdmin } = require("../middleware/authorize");
const brandRouter = express.Router();

brandRouter.get("/", isAdmin, brandController.getAllBrandsView);
brandRouter.get("/new", isAdmin, (req, res) =>
  res.render("newBrand", { title: "Add New Brand" })
);
brandRouter.post("/", isAdmin, brandController.createBrandView);
brandRouter.get("/:brandId/edit", isAdmin, brandController.getBrandByIdView);
brandRouter.post("/:brandId/edit", isAdmin, brandController.updateBrandView);
brandRouter.post("/:brandId/delete", isAdmin, brandController.deleteBrandView);
module.exports = brandRouter;
