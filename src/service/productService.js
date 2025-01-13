import mongoose from "mongoose";
import Product from "../model/Product.js";
import WineCategory from "../model/WineCategory.js";
import Order from "../model/Order.js";
import Discount from "../model/Discount.js";
import { paginate } from "mongoose-paginate-v2";

export const productService = {
    // Add a new product
    addProduct: async (productData) => {
        try {
            // Check if a product with the same name already exists
            const existingProduct = await Product.findOne({ name: productData.name });
            if (existingProduct) {
                throw new Error("A product with the same name already exists");
            }

            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error(error.message || "Failed to add product");
        }
    },

    // Update an existing product
    updateProduct: async (productId, productData) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
            if (!updatedProduct) {
                throw new Error("Product not found");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(error.message || "Failed to update product");
        }
    },

    // View a single product by ID
    viewSingleProduct: async (productId) => {
        try {
            const product = await Product.findById(productId)
                .populate({
                    path: "country",
                    populate: {
                        path: "regions",
                        model: "WineRegion",
                        select: "region _id",
                        populate: {
                            path: "subRegions",
                            model: "SubRegion",
                            select: "name _id"
                        }
                    }
                })
                .populate("categories")
                .populate("regions")
                .populate("vintage")
                .populate("dryness")
                .populate("size")
                .populate("type")
                // .populate("sizeTypes")
                // .populate("collectables")
                .populate("subCategories")
                .populate("subRegions");

            if (!product) {
                throw new Error("Product not found");
            }

            return product;
        } catch (error) {
            // console.log(error)
            throw new Error(error.message || "Failed to fetch product");
        }
    },

    // Get paginated products with filters and sorting
    getAllProductsPaginated: async ({
        page = 1,
        limit = 10,
        sortBy = "unitPrice",
        sortOrder = "asc",
        search,
        name,
        vintageId,
        priceMin,
        priceMax,
        subRegionId,
        subCategoryId,
        drynessId,
        sizeTypeId,
        collectableId,
        abvMin,
        abvMax,
        categoryId,
    }) => {
        try {
            const query = { isActive: true };

            if (name && name.trim()) {
                query.name = { $regex: new RegExp(name, "i") };
            }

            if (search && search.trim()) {
                const searchRegex = new RegExp(search, "i");
                query.$or = [{ name: { $regex: searchRegex } }, { description: { $regex: searchRegex } }];
            }

            if (vintageId) {
                query.vintage = new mongoose.Types.ObjectId(vintageId);
            }

            if (priceMin || priceMax) {
                query.unitPrice = {};
                if (priceMin) query.unitPrice.$gte = parseFloat(priceMin);
                if (priceMax) query.unitPrice.$lte = parseFloat(priceMax);
            }

            if (subRegionId) {
                query.subRegions = { $in: subRegionId.split(",").map(id => new mongoose.Types.ObjectId(id)) };
            }

            if (subCategoryId) {
                query.subCategories = { $in: subCategoryId.split(",").map(id => new mongoose.Types.ObjectId(id)) };
            }

            if (drynessId) {
                query.dryness = new mongoose.Types.ObjectId(drynessId);
            }

            if (sizeTypeId) {
                query.sizeTypes = { $in: sizeTypeId.split(",").map(id => new mongoose.Types.ObjectId(id)) };
            }

            if (collectableId) {
                query.collectables = { $in: collectableId.split(",").map(id => new mongoose.Types.ObjectId(id)) };
            }

            if (abvMin || abvMax) {
                query.abv = {};
                if (abvMin) query.abv.$gte = parseFloat(abvMin);
                if (abvMax) query.abv.$lte = parseFloat(abvMax);
            }

            if (categoryId) {
                query.categories = { $in: categoryId.split(",").map(id => new mongoose.Types.ObjectId(id)) };
            }

            const options = {
                sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                populate: [
                    { path: "categories", select: "name" },
                    { path: "regions", select: "region" },
                    { path: "vintage", select: "year description" },
                    { path: "sizeTypes", select: "name" },
                    { path: "collectables", select: "name" },
                    { path: "subCategories", select: "name" },
                    { path: "subRegions", select: "name" }
                ],
            };

            const products = await Product.paginate(query, options);

            // Add discount for each product
            const productsWithDiscounts = await Promise.all(
                products.docs.map(async product => {
                    const discounts = [];

                    // Step 1: Search for a product-specific discount
                    const productDiscounts = await Discount.find({
                        discountType: 'product',
                        productId: product._id,
                        isActive: true,
                    }).sort({ unitDiscount: -1, packDiscount: -1 });

                    if (productDiscounts) {
                        discounts.push(...productDiscounts); // Add product discounts to the list
                    }

                    if (product.categories && product.categories.length > 0) {
                        // Step 3: Search for category-specific discounts
                        const categoryDiscounts = await Discount.find({
                            discountType: 'category',
                            categoryId: { $in: product.categories },
                            isActive: true,
                        });

                        if (categoryDiscounts && categoryDiscounts.length > 0) {
                            discounts.push(...categoryDiscounts); // Add all category discounts to the list
                        }
                    }

                    // Calculate the maximum discount
                    const maxDiscount = discounts.reduce((prev, current) => {
                        return current.unitDiscount > prev.unitDiscount
                            ? {
                                unitDiscount: current.unitDiscount,
                                packDiscount: current.packDiscount,
                                discountName: current.discountName
                            }
                            : {
                                unitDiscount: prev.unitDiscount,
                                packDiscount: prev.packDiscount,
                                discountName: prev.discountName
                            };
                    }, { unitDiscount: 0, packDiscount: 0, discountName: '' });


                    return {
                        ...product.toObject(),
                        ...maxDiscount,
                    };
                })
            );

            // Replace docs with updated products
            return {
                ...products,
                docs: productsWithDiscounts,
            };


            // return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error(error.message || "Failed to fetch products");
        }
    },


    // Get paginated Accessories with filters and sorting
    getAllAccessoriesPaginated: async ({ page = 1, limit = 10, }) => {
        try {

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                populate: [{ path: "categories", select: "name" },
                { path: "regions", select: "region" },
                { path: "vintage", select: "year description" },
                { path: "sizeTypes", select: "name" },
                { path: "collectables", select: "name" },
                { path: "subCategories", select: "name" },
                { path: "subRegions", select: "name" }
                ],
            };

            const accessoriesId = await WineCategory.findOne({ name: "Accessories" }).select("_id");

            if (!accessoriesId) {
                throw new Error("Accessories category not found");
            }

            const query = {};
            if (accessoriesId) {
                query.categories = accessoriesId; // Apply filter for category
            }

            const products = await Product.paginate(query, options);

            if (!products.docs.length) {
                // console.log("No matching products found.");
            }

            // Add discount for each product
            const productsWithDiscounts = await Promise.all(
                products.docs.map(async product => {
                    const discounts = [];

                    // Step 1: Search for a product-specific discount
                    const productDiscounts = await Discount.find({
                        discountType: 'product',
                        productId: product._id,
                        isActive: true,
                    }).sort({ unitDiscount: -1, packDiscount: -1 });

                    if (productDiscounts) {
                        discounts.push(...productDiscounts); // Add product discounts to the list
                    }

                    if (product.categories && product.categories.length > 0) {
                        // Step 3: Search for category-specific discounts
                        const categoryDiscounts = await Discount.find({
                            discountType: 'category',
                            categoryId: { $in: product.categories },
                            isActive: true,
                        });

                        if (categoryDiscounts && categoryDiscounts.length > 0) {
                            discounts.push(...categoryDiscounts); // Add all category discounts to the list
                        }
                    }

                    // Calculate the maximum discount
                    const maxDiscount = discounts.reduce((prev, current) => {
                        return current.unitDiscount > prev.unitDiscount
                            ? {
                                unitDiscount: current.unitDiscount,
                                packDiscount: current.packDiscount,
                                discountName: current.discountName
                            }
                            : {
                                unitDiscount: prev.unitDiscount,
                                packDiscount: prev.packDiscount,
                                discountName: prev.discountName
                            };
                    }, { unitDiscount: 0, packDiscount: 0, discountName: '' });


                    return {
                        ...product.toObject(),
                        ...maxDiscount,
                    };
                })
            );

            // Replace docs with updated products
            return {
                ...products,
                docs: productsWithDiscounts,
            };

            // return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error(error.message || "Failed to fetch products");
        }
    },

    // Get paginated Accessories with filters and sorting
    getGreatForGiftPaginated: async ({ page = 1, limit = 10, }) => {
        try {

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                populate: [
                    { path: "categories", select: "name" },
                    { path: "regions", select: "region" },
                    { path: "vintage", select: "year description" },
                    { path: "sizeTypes", select: "name" },
                    { path: "collectables", select: "name" },
                    { path: "subCategories", select: "name" },
                    { path: "subRegions", select: "name" },
                ],
            };

            const query = { isGreatForGift: true };

            const products = await Product.paginate(query, options);

            if (!products.docs.length) {
                // console.log("No matching products found.");
            }

            // Add discount for each product
            const productsWithDiscounts = await Promise.all(
                products.docs.map(async product => {
                    const discounts = [];

                    // Step 1: Search for a product-specific discount
                    const productDiscounts = await Discount.find({
                        discountType: 'product',
                        productId: product._id,
                        isActive: true,
                    }).sort({ unitDiscount: -1, packDiscount: -1 });

                    if (productDiscounts) {
                        discounts.push(...productDiscounts); // Add product discounts to the list
                    }

                    if (product.categories && product.categories.length > 0) {
                        // Step 3: Search for category-specific discounts
                        const categoryDiscounts = await Discount.find({
                            discountType: 'category',
                            categoryId: { $in: product.categories },
                            isActive: true,
                        });

                        if (categoryDiscounts && categoryDiscounts.length > 0) {
                            discounts.push(...categoryDiscounts); // Add all category discounts to the list
                        }
                    }

                    // Calculate the maximum discount
                    const maxDiscount = discounts.reduce((prev, current) => {
                        return current.unitDiscount > prev.unitDiscount
                            ? {
                                unitDiscount: current.unitDiscount,
                                packDiscount: current.packDiscount,
                                discountName: current.discountName
                            }
                            : {
                                unitDiscount: prev.unitDiscount,
                                packDiscount: prev.packDiscount,
                                discountName: prev.discountName
                            };
                    }, { unitDiscount: 0, packDiscount: 0, discountName: '' });


                    return {
                        ...product.toObject(),
                        ...maxDiscount,
                    };
                })
            );

            // Replace docs with updated products
            return {
                ...products,
                docs: productsWithDiscounts,
            };

            // return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error(error.message || "Failed to fetch products");
        }
    },

    // Get paginated Accessories with filters and sorting
    // getBestSaleProductPaginated: async ({page = 1, limit = 10}) => {
    //     try {
    //
    //         // Aggregate the most ordered products from the Order collection
    //         const bestSellingProducts = await Order.aggregate([
    //             {$unwind: "$products"}, // Flatten the `products` array
    //             {
    //                 $group: {
    //                     _id: "$products.product", // Group by product ID
    //                     totalQuantity: {$sum: "$products.quantity"}, // Sum quantities
    //                 },
    //             },
    //             {$sort: {totalQuantity: -1}}, // Sort by total quantity (descending)
    //             {$limit: parseInt(limit, 10)}, // Limit the results
    //         ]) || [{}];
    //
    //         // Check if aggregation result exists
    //         if (!bestSellingProducts || bestSellingProducts.length === 0) {
    //             // console.log("No best-selling products found.");
    //             return [];
    //         }
    //
    //         // Extract product IDs
    //         const productIds = bestSellingProducts.map((item) => item._id);
    //
    //
    //         // Fetch product details from the Product collection
    //         const products = await Product.find({_id: {$in: productIds}}).populate([
    //             {path: "categories", select: "name"},
    //             {path: "regions", select: "region"},
    //             {path: "vintage", select: "year description"},
    //             {path: "sizeTypes", select: "name"},
    //             {path: "collectables", select: "name"},
    //             {path: "subCategories", select: "name"},
    //             {path: "subRegions", select: "name"},
    //         ]);
    //
    //         // Map results to include total sales
    //         const result = bestSellingProducts.map((item) => {
    //             const product = products.find((prod) => prod._id.equals(item._id));
    //             return product
    //                 ? {...product.toObject(), totalQuantitySold: item.totalQuantity}
    //                 : null;
    //         }).filter(Boolean);
    //
    //         return result;
    //     } catch (error) {
    //         console.error("Error fetching best-selling products:", error);
    //         throw new Error(error.message || "Failed to fetch best-selling products");
    //     }
    // },

    getBestSaleProductPaginated: async ({ page = 1, limit = 10 }) => {
        try {
            // Aggregate the most ordered products from the Order collection
            const bestSellingProducts = await Order.aggregate([
                { $unwind: "$products" }, // Flatten the `products` array
                {
                    $group: {
                        _id: "$products.product", // Group by product ID
                        totalQuantity: { $sum: "$products.quantity" }, // Sum quantities
                    },
                },
                { $sort: { totalQuantity: -1 } } // Sort by total quantity (descending)
            ]);

            // Check if aggregation result exists
            if (!bestSellingProducts || bestSellingProducts.length === 0) {
                // console.log("No best-selling products found.");
                return [];
            }

            const totalDocs = bestSellingProducts.length;
            const totalPages = Math.ceil(totalDocs / limit);

            // Pagination logic
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedProducts = bestSellingProducts.slice(startIndex, endIndex);

            // Extract product IDs for the current page
            const productIds = paginatedProducts.map((item) => item._id);

            // Fetch product details from the Product collection
            const products = await Product.find({ _id: { $in: productIds } }).populate([
                { path: "categories", select: "name" },
                { path: "regions", select: "region" },
                { path: "vintage", select: "year description" },
                { path: "sizeTypes", select: "name" },
                { path: "collectables", select: "name" },
                { path: "subCategories", select: "name" },
                { path: "subRegions", select: "name" },
            ]);

            // Map results to include total sales
            const result = paginatedProducts.map((item) => {
                const product = products.find((prod) => prod._id.equals(item._id));
                return product
                    ? { ...product.toObject(), totalQuantitySold: item.totalQuantity }
                    : null;
            }).filter(Boolean);

            const productsWithDiscounts = await Promise.all(
                result.map(async product => {
                    const discounts = [];

                    // Step 1: Search for a product-specific discount
                    const productDiscounts = await Discount.find({
                        discountType: 'product',
                        productId: product._id,
                        isActive: true,
                    }).sort({ unitDiscount: -1, packDiscount: -1 });

                    if (productDiscounts) {
                        discounts.push(...productDiscounts); // Add product discounts to the list
                    }

                    if (product.categories && product.categories.length > 0) {
                        // Step 3: Search for category-specific discounts
                        const categoryDiscounts = await Discount.find({
                            discountType: 'category',
                            categoryId: { $in: product.categories },
                            isActive: true,
                        });

                        if (categoryDiscounts && categoryDiscounts.length > 0) {
                            discounts.push(...categoryDiscounts); // Add all category discounts to the list
                        }
                    }

                    // Calculate the maximum discount
                    const maxDiscount = discounts.reduce((prev, current) => {
                        return current.unitDiscount > prev.unitDiscount
                            ? {
                                unitDiscount: current.unitDiscount,
                                packDiscount: current.packDiscount,
                                discountName: current.discountName
                            }
                            : {
                                unitDiscount: prev.unitDiscount,
                                packDiscount: prev.packDiscount,
                                discountName: prev.discountName
                            };
                    }, { unitDiscount: 0, packDiscount: 0, discountName: '' });


                    return product ? {
                        ...product,
                        ...maxDiscount,
                    } : null;
                })
            );

            return {
                docs: productsWithDiscounts,
                totalDocs,
                limit,
                totalPages,
                page
            };
        } catch (error) {
            console.error("Error fetching best-selling products:", error);
            throw new Error(error.message || "Failed to fetch best-selling products");
        }
    },


    // Delete product by setting isActive to false
    deleteProduct: async (productId) => {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                throw new Error("Product not found");
            }

            // Check if product is already deleted (isActive is false)
            if (!product.isActive) {
                throw new Error("Product is already deleted");
            }

            // Set both isActive and inStock to false
            const updatedProduct = await Product.findByIdAndUpdate(productId, {
                isActive: false, inStock: false
            }, { new: true });
            return updatedProduct;
        } catch (error) {
            throw new Error(error.message || "Failed to delete product");
        }
    },

    addRating: async (productId, newRating) => {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Calculate new average rating
            const totalRatings = (product.rating || 0) * (product.ratingsCount || 0) + newRating;
            const newRatingsCount = (product.ratingsCount || 0) + 1;
            const averageRating = totalRatings / newRatingsCount;

            // Update product with new rating and ratings count
            product.rating = averageRating;
            product.ratingsCount = newRatingsCount;

            const updatedProduct = await product.save();
            return updatedProduct;
        } catch (error) {
            throw new Error(error.message || "Failed to add rating");
        }
    },
};
