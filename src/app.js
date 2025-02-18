import express from "express";
import cors from "cors";
import {errorLogger} from "./middleware/errorLogger.js";
import userRoutes from './route/userRoutes.js';
import metaDataRoutes from './route/metaDataRoutes.js';
import imageRoutes from './route/imageRoutes.js';
import productRoutes from "./route/productRoutes.js";
import orderRoutes from "./route/orderRoutes.js";
import testRoutes from "./route/testRoutes.js";
import favouriteRoutes from "./route/favouriteRoutes.js";
import cartRoutes from "./route/cartRoutes.js";
import paymentMethodRoutes from "./route/paymentMethodRoutes.js";
import addressRoutes from "./route/addressRoutes.js";
import membershipPlanRouts from "./route/membershipPlanRouts.js";
import wineCategoryRoutes from "./route/wineCategoryRoutes.js";
import wineRegionRoutes from "./route/wineRegionRoutes.js";
import wineDiscountRoutes from "./route/discountRoutes.js";
import sizeRoutes from "./route/sizeRoutes.js";
import vintageRoutes from "./route/vintageRoutes.js";
import CountryRoutes from "./route/countryRoutes.js";
import subRegionsRoutes from "./route/subRegionRoutes.js"

const app = express();

// Enable CORS for all origins
app.use(
    cors({
        origin: "*",
        methods: "*",
        credentials: true,
    })
);


// Parse JSON request bodies
app.use(express.json());

// Global error handler (must be the last middleware)
app.use(errorLogger);

// Health-check route
app.get("/v1/health-check", (req, res) => {
    res.status(200).json({status: "Server is up and running"});
});

// Routes
app.use('/', metaDataRoutes);
app.use('/v1/images', imageRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/products', productRoutes);
app.use('/v1/orders', orderRoutes);
app.use('/v1/t', testRoutes);
app.use('/v1/fav', favouriteRoutes);
app.use('/v1/cart', cartRoutes);
app.use('/v1/paymentMethod', paymentMethodRoutes);
app.use('/v1/address', addressRoutes);
app.use('/v1/membershipPlan', membershipPlanRouts);
app.use('/v1/wine-categories', wineCategoryRoutes);
app.use('/v1/wineRegions', wineRegionRoutes);
app.use('/v1/discount', wineDiscountRoutes);
app.use('/v1/size', sizeRoutes);
app.use('/v1/vintage', vintageRoutes);
app.use('/v1/country', CountryRoutes);
app.use('/v1/subRegions', subRegionsRoutes);

export default app;
