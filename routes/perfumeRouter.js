const express = require("express");
const perfumeRouter = express.Router();
const perfumeController = require("../controllers/perfumeController");
const Brand = require("../models/brand.model");
const { isAdmin, isMember } = require("../middleware/authorize");

perfumeRouter.get("/", isAdmin, perfumeController.getAllPerfumesManage);
perfumeRouter.get("/new", isAdmin, async (req, res) => {
  const brands = await Brand.find();
  res.render("newPerfume", { title: "Add New Perfume", brands });
});
perfumeRouter.get("/:perfumeId", perfumeController.getPerfumeDetailViews);

perfumeRouter.post(
  "/:perfumeId/comment",
  isMember,
  perfumeController.postCommentRatingOnPerfume
);

perfumeRouter.post("/", isAdmin, perfumeController.createPerfumeManage);
perfumeRouter.get(
  "/:perfumeId/edit",
  isAdmin,
  perfumeController.getPerfumeByIdManage
);
perfumeRouter.post(
  "/:perfumeId/edit",
  isAdmin,
  perfumeController.updatePerfumeManage
);
perfumeRouter.post(
  "/:perfumeId/delete",
  isAdmin,
  perfumeController.deletePerfumeManage
);
module.exports = perfumeRouter;
