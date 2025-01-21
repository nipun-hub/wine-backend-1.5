import express from "express";
import { subRegionController } from "../controller/subRegionController.js";

const router = express.Router();

// add sub region
router.post('/add', subRegionController.add);

// update sub regions
router.put('/update/:subRegionId', subRegionController.update);

export default router;