import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated,sendMessage);
router.route('/all/:id').post(isAuthenticated,getMessage);


export default router;