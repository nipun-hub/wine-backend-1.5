import {productService} from "../service/productService.js";
import {errorResponse, successResponse} from "../util/responseUtil.js";

export const productController = {
    // Add new product
    addProduct: async (req, res) => {
        try {
            const productData = req.body;

            const response = await productService.addProduct(productData);
            return successResponse(res, "Product added successfully", response, 201);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Update product
    updateProduct: async (req, res) => {
        const {productId} = req.params;
        const productData = req.body;

        try {
            const response = await productService.updateProduct(productId, productData);
            return successResponse(res, "Product updated successfully", response, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // View single product
    viewSingleProduct: async (req, res) => {
        const {productId} = req.params;

        try {
            const product = await productService.viewSingleProduct(productId);
            return successResponse(res, "Product fetched successfully", product, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Get all products with pagination, sorting, and filters
    getAllProductsPaginated: async (req, res) => {
        const {
            page = 1,
            limit = 10,
            sortBy = "unitPrice",
            sortOrder = "asc",
            search,
            name,
            vintageId,
            priceMin,
            priceMax,
            countryId,
            subRegionId,
            subCategoryId,
            drynessId,
            sizeId,
            typeId,
            abvMin,
            abvMax,
            categoryId,
        } = req.query;

        try {
            const products = await productService.getAllProductsPaginated({
                page,
                limit,
                sortBy,
                sortOrder,
                search,
                name,
                vintageId,
                priceMin,
                priceMax,
                countryId,
                subRegionId,
                subCategoryId,
                drynessId,
                sizeId,
                typeId,
                abvMin,
                abvMax,
                categoryId,
            });

            // console.log(products)


            return successResponse(res, "Products fetched successfully", {
                docs: products.docs.map((product) => {
                    const {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        isPack,
                        pack,
                        inStock,
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    } = product;

                    return {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        inStock,
                        isPack,
                        pack: isPack ? pack : [],
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    };
                }),
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
            }, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Get all Accessories products with pagination, sorting, and Accessories
    getAllAccessoriesPaginated: async (req, res) => {
        console.log("Accessories")
        const {
            page = 1, limit = 10,
        } = req.query;
        try {
            // Fetch products using the service
            const products = await productService.getAllAccessoriesPaginated({
                page, limit,
            });

            return successResponse(res, "Products fetched successfully", {
                docs: products.docs.map((product) => {
                    const {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        isPack,
                        pack,
                        inStock,
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    } = product;

                    return {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        inStock,
                        isPack,
                        pack: isPack ? pack : [],
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    };
                }),
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
            }, 200);

        } catch (err) {
            // Log error for debugging
            console.error("Error fetching products:", err);

            // Return error response
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Get Grate for gift products with pagination, sorting, and Accessories
    getGreatForGiftPaginated: async (req, res) => {
        const {
            page = 1, limit = 10,
        } = req.query;

        try {
            // Fetch products using the service
            const products = await productService.getGreatForGiftPaginated({
                page, limit,
            });

            return successResponse(res, "Products fetched successfully", {
                docs: products.docs.map((product) => {
                    const {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        isPack,
                        pack,
                        inStock,
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    } = product;

                    return {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        inStock,
                        isPack,
                        pack: isPack ? pack : [],
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    };
                }),
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
            }, 200);

        } catch (err) {
            // Log error for debugging
            console.error("Error fetching products:", err);

            // Return error response
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Get Best sale products with pagination, sorting, and Accessories
    getBestSaleProductPaginated: async (req, res) => {
        const {
            page = 1, limit = 10,
        } = req.query;

        try {
            // Fetch products using the service
            const products = await productService.getBestSaleProductPaginated({
                page, limit,
            });

            return successResponse(res, "Products fetched successfully", {
                docs: products.docs.map((product) => {
                    const {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        isPack,
                        pack,
                        inStock,
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    } = product;

                    return {
                        _id,
                        name,
                        description,
                        unitBuyingPrice,
                        unitPrice,
                        unitDiscount,
                        packSize,
                        packBuyingPrice,
                        packPrice,
                        packDiscount,
                        discountName,
                        isGreatForGift,
                        rating,
                        qtyOnHand,
                        categories,
                        subCategories,
                        regions,
                        subRegions,
                        country,
                        vintage,
                        size,
                        type,
                        abv,
                        collectables,
                        image,
                        inStock,
                        isPack,
                        pack: isPack ? pack : [],
                        isActive,
                        dryness,
                        createdAt,
                        updatedAt,
                    };
                }),
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
            }, 200);

        } catch (err) {
            // Log error for debugging
            console.error("Error fetching products:", err);

            // Return error response
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Delete product by setting isActive to false
    deleteProduct: async (req, res) => {
        const {productId} = req.params;

        try {
            const updatedProduct = await productService.deleteProduct(productId);
            return successResponse(res, "Product deactivated successfully", updatedProduct, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Add rating
    addRating: async (req, res) => {
        const {productId} = req.params;
        const {rating} = req.body;

        try {
            if (typeof rating !== "number" || rating < 0 || rating > 5) {
                throw new Error("Rating must be a number between 0 and 5");
            }
            const updatedProduct = await productService.addRating(productId, rating);
            return successResponse(res, "Rating added successfully", updatedProduct, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },
};
