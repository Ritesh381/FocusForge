const express = require("express");
const {
  planDay,
  addSubtasks,
  startSession,
  completeSession,
  reflectSession,
  getDashboard,
} = require("../controllers/sessionController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.post("/plan", planDay);
router.put("/:id/breakdown", addSubtasks);
router.post("/:id/start", startSession);
router.post("/:id/complete", completeSession);
router.post("/:id/reflect", reflectSession);
router.get("/dashboard", getDashboard);

module.exports = router;
