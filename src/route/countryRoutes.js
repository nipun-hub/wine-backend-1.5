import express from "express";
import { countryController } from "../controller/countryController.js";

const router = express.Router();

router.post('/add', countryController.save);
router.put('/update/:id', countryController.update);

export default router;