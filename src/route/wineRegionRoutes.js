import express from "express";
import { wineRegionController } from "../controller/wineRegionController.js";

const router = express.Router();

// Route to add a new wine region
router.post('/add/:countryId', wineRegionController.add);

// Route to update a wine region
router.put('/update/:regionId', wineRegionController.update);

// Route to delete a wine region
router.delete('/:regionId', wineRegionController.deleteRegion);

export default router;