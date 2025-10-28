import express from "express";
import { getStream, sendTimeControl } from "../controllers/camController.js";

const router = express.Router();

router.get("/stream", getStream);
router.post("/time-control", sendTimeControl);

export default router;
