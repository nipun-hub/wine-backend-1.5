import express from "express";
import { vintageController } from "../controller/vintageController.js";


const router = express.Router();

router.post('/', vintageController.save);

router.get('/', vintageController.getAll);

router.put('/:id', vintageController.update);

export default router;