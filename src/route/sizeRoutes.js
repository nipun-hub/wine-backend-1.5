import express from "express";
import { sizeController } from "../controller/sizeController.js";


const router = express.Router();

router.post('/add', sizeController.save);

router.get('/all', sizeController.getAll);

router.put('/update/:id', sizeController.update);

export default router;