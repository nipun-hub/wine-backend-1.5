import express from "express";
import {wineRegionController} from "../controller/wineRegionController.js";

const router = express.Router();

// Route to add a new wine region
router.post('/add', wineRegionController.addRegion);

// Route to update a wine region
router.put('/update/:regionId', wineRegionController.updateRegion);

// Route to delete a wine region
router.delete('/:regionId', wineRegionController.deleteRegion);

export default router;

