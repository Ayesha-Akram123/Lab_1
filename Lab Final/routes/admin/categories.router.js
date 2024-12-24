const express = require("express");
const router = express.Router();
const Category = require("../../models/category");


router.get("/categories", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sort = req.query.sort || "title";
        const order = req.query.order || "asc";
        const filter = req.query.filter || "";

        const query = { title: { $regex: search, $options: "i" } };

        if (filter === "high") {
            query.numberOfItems = { $gt: 10 };
        } else if (filter === "low") {
            query.numberOfItems = { $lte: 10 };
        }

        const totalCategories = await Category.countDocuments(query);

        const categories = await Category.find(query)
            .sort({ [sort]: order })
            .skip((page - 1) * limit)
            .limit(limit);

        res.render("admin/categories", {
            layout: "admin/admin-layout",
            categories,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit),
            search,
            sort,
            order,
            filter,
            title: "Categories"
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).render("admin/error", {
            layout: "admin/admin-layout",
            error: "Unable to fetch categories"
        });
    }
});


router.get("/categories/create", (req, res) => {
    res.render("admin/create-category", {
        layout: "admin/admin-layout",
        title: "Create Category"
    });
});


router.post("/categories/create", async (req, res) => {
    try {
        const { title, description, numberOfItems } = req.body;
        const newCategory = new Category({ title, description, numberOfItems });
        await newCategory.save();
        req.flash("success_msg", "Category created successfully.");
        res.redirect("/admin/categories");
    } catch (error) {
        req.flash("error_msg", "Error creating category");
        console.error("Error creating category:", error);
        res.status(500).render("admin/error", {
            layout: "admin/admin-layout",
            error: "Unable to create category"
        });
    }
});


router.get("/categories/edit/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).render("admin/error", {
                layout: "admin/admin-layout",
                error: "Category not found"
            });
        }
        res.render("admin/edit-category", {
            layout: "admin/admin-layout",
            category,
            title: "Edit Category"
        });
        req.flash("success_msg", "Category updated successfully.");
    } catch (error) {
        req.flash("error_msg", "Error updating category.");
        console.error("Error fetching category for edit:", error);
        res.status(500).render("admin/error", {
            layout: "admin/admin-layout",
            error: "Unable to fetch category for editing"
        });
    }
});


router.post("/categories/edit/:id", async (req, res) => {
    try {
        const { title, description, numberOfItems } = req.body;
        await Category.findByIdAndUpdate(req.params.id, { title, description, numberOfItems });
        res.redirect("/admin/categories");
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).render("admin/error", {
            layout: "admin/admin-layout",
            error: "Unable to update category"
        });
    }
});


router.get("/categories/delete/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect("/admin/categories");
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).render("admin/error", {
            layout: "admin/admin-layout",
            error: "Unable to delete category"
        });
    }
});

module.exports = router; 