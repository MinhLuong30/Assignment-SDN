const Perfume = require("../models/perfume.model");
const mongoose = require("mongoose");
const Brand = require("../models/brand.model");

exports.getAllPerfumeViews = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const brandFilter = req.query.brand || "";
    const brandQuery = brandFilter ? { brand: brandFilter } : {};

    const allPerfumes = await Perfume.find({
      perfumeName: { $regex: searchQuery, $options: "i" },
      ...brandQuery,
    }).populate("brand");

    const allBrands = await Brand.find();

    return res.render("home", {
      title: "Home",
      perfumes: allPerfumes,
      search: searchQuery,
      brands: allBrands,
      selectedBrand: brandFilter,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getPerfumeDetailViews = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId)
      .populate("brand")
      .populate("comments.author");
    if (!perfume) return res.status(404).send("Perfume not found");

    res.render("detailPerfume", { title: perfume.perfumeName, perfume });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getAllPerfumesManage = async (req, res) => {
  try {
    const perfumes = await Perfume.find().populate("brand");
    res.render("managePerfume", { title: "Manage Perfumes", perfumes });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getPerfumeByIdManage = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId).populate(
      "brand"
    );
    const brands = await Brand.find();
    res.render("editPerfume", { title: "Edit Perfume", perfume, brands });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createPerfumeManage = async (req, res) => {
  try {
    const {
      perfumeName,
      uri,
      price,
      concentration,
      ingredients,
      description,
      volume,
      targetAudience,
      brandId,
    } = req.body;
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const newPerfume = new Perfume({
      perfumeName,
      uri,
      price,
      concentration,
      ingredients,
      description,
      volume,
      targetAudience,
      brand: brandId,
    });
    await newPerfume.save();

    brand.perfumes.push(newPerfume._id);
    await brand.save();
    req.flash("success_msg", "Add Brand Successfully");
    res.redirect("/perfume");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updatePerfumeManage = async (req, res) => {
  try {
    const {
      perfumeName,
      uri,
      price,
      concentration,
      ingredients,
      description,
      volume,
      targetAudience,
      brandId,
    } = req.body;
    const perfume = await Perfume.findById(req.params.perfumeId);

    if (!perfume) {
      req.flash("error_msg", "Perfume not found");
      res.redirect("/perfume");
    }

    if (brandId && brandId !== perfume.brand.toString()) {
      const oldBrand = await Brand.findById(perfume.brand);
      const newBrand = await Brand.findById(brandId);
      if (!newBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      oldBrand.perfumes.pull(perfume._id);
      await oldBrand.save();

      newBrand.perfumes.push(perfume._id);
      await newBrand.save();

      perfume.brand = brandId;
    }

    perfume.perfumeName = perfumeName;
    perfume.uri = uri;
    perfume.price = price;
    perfume.concentration = concentration;
    perfume.ingredients = ingredients;
    perfume.description = description;
    perfume.volume = volume;
    perfume.targetAudience = targetAudience;

    await perfume.save();
    req.flash("success_msg", "Update Perfume Successfully");
    res.redirect("/perfume");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deletePerfumeManage = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndDelete(req.params.perfumeId);
    if (!perfume) {
      req.flash("error_msg", "Brand not found");
      res.redirect("/perfume");
    }
    req.flash("success_msg", "Delete Perfume Successfully");
    res.redirect("/perfume");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.postCommentRatingOnPerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.perfumeId);
    if (!perfume) {
      return res.status(404).send("Perfume not found");
    }

    // Check if the member has already commented on this perfume
    const existingComment = perfume.comments.find((comment) =>
      comment.author.equals(req.session.user._id)
    );
    if (existingComment) {
      req.flash("error_msg", "You have already commented on this perfume");
      return res.redirect(`/perfume/${req.params.perfumeId}`);
    }
    // Add the new comment
    const newComment = {
      rating: req.body.rating,
      content: req.body.content,
      author: req.session.user._id,
    };
    perfume.comments.push(newComment);
    await perfume.save();

    res.redirect(`/perfume/${req.params.perfumeId}`);
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect(`/perfume/${req.params.perfumeId}`);
  }
};
