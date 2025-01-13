import express from 'express';
import { metaDataController } from '../controller/metaDataController.js';

const router = express.Router();

// Route for fetching all metadata
router.get('/all', metaDataController.fetchMetaData);

export default router;
