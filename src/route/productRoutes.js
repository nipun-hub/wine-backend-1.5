import express from "express";
import { productController } from "../controller/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (requires authMiddleware)
router.post("/add", productController.addProduct);
router.put("/update/:productId", productController.updateProduct);
router.delete('/delete/:productId', productController.deleteProduct);
router.post("/rate/:productId", productController.addRating);



// Public routes
router.get("/:productId", productController.viewSingleProduct);
router.get("", productController.getAllProductsPaginated);
router.get("/getAccessories", productController.getAllAccessoriesPaginated);
router.get("/getGreatForGift", productController.getGreatForGiftPaginated);
router.get("/getBestSaleProduct", productController.getBestSaleProductPaginated);

export default router;
