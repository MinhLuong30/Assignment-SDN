const Brand = require("../models/brand.model");
const mongoose = require("mongoose");
const Perfume = require("../models/perfume.model");

exports.getAllBrand = async (req, res) => {
  try {
    const allBrands = await Brand.find().populate("perfumes");
    res.status(200).json(allBrands);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.insertBrand = async (req, res) => {
  try {
    const brand = new Brand({
      brandName: req.body.brandName,
    });
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId).populate("perfumes");
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const updatedbrand = await Brand.findByIdAndUpdate(
      req.params.brandId,
      req.body,
      { new: true }
    );

    if (!updatedbrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(updatedbrand);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getAllBrandsView = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.render("manageBrand", { title: "Manage Brands", brands });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getBrandByIdView = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId);
    res.render("editBrand", { title: "Edit Brand", brand });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createBrandView = async (req, res) => {
  try {
    const { brandName } = req.body;
    const newBrand = new Brand({ brandName });
    await newBrand.save();
    req.flash("success_msg", "Add Brand Successfully");
    res.redirect("/brand");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateBrandView = async (req, res) => {
  try {
    const { brandName } = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.brandId, {
      brandName,
    });
    if (!brand) {
      req.flash("error_msg", "Brand not found");
      res.redirect("/brand");
    }
    req.flash("success_msg", "Update Brand Successfully");
    res.redirect("/brand");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteBrandView = async (req, res) => {
  try {
    const perfumes = await Perfume.find({ brand: req.params.brandId });

    if (perfumes.length > 0) {
      req.flash("error_msg", "Brand has associated perfumes, cannot delete");
      return res.redirect("/brand");
    }
    const brand = await Brand.findByIdAndDelete(req.params.brandId);

    if (!brand) {
      req.flash("error_msg", "Brand not found");
      res.redirect("/brand");
    }

    req.flash("success_msg", "Delete Brand Successfully");
    res.redirect("/brand");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
