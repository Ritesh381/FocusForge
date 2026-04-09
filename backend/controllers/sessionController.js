const Session = require("../models/Session");
const User = require("../models/User");

// @desc    Plan day (up to 3 goals)
// @route   POST /api/sessions/plan
const planDay = async (req, res) => {
  try {
    const { goals } = req.body; // Array of { goal, duration }
    if (!goals || !Array.isArray(goals) || goals.length === 0 || goals.length > 3) {
      return res.status(400).json({ success: false, message: "Provide 1 to 3 goals" });
    }

    const sessions = await Session.insertMany(
      goals.map(g => ({
        user: req.user._id,
        goal: g.goal,
        duration: g.duration || 25,
        status: "planned"
      }))
    );

    res.status(201).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subtasks for a planned goal
// @route   PUT /api/sessions/:id/breakdown
const addSubtasks = async (req, res) => {
  try {
    const { subtasks } = req.body; // Array of strings
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    session.subtasks = subtasks.map(t => ({ title: t, isCompleted: false }));
    await session.save();

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start a session (Commit)
// @route   POST /api/sessions/:id/start
const startSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    
    if (session.status !== "planned") {
        return res.status(400).json({ success: false, message: "Only planned sessions can be started" });
    }

    session.status = "active";
    session.startedAt = new Date();
    await session.save();

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a session & subtasks
// @route   POST /api/sessions/:id/complete
const completeSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id, status: "active" });
    if (!session) return res.status(404).json({ success: false, message: "No active session found" });

    const now = new Date();
    const timeSpent = Math.floor((now - session.startedAt) / 1000);

    session.status = "completed";
    session.completedAt = now;
    session.timeSpent = timeSpent;
    // Auto-complete all subtasks
    session.subtasks.forEach(st => st.isCompleted = true);
    await session.save();

    // Update User Streak
    const user = await User.findById(req.user._id);
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (!lastActive) {
        user.streak = 1;
    } else {
        const lastActiveDay = new Date(lastActive);
        lastActiveDay.setHours(0,0,0,0);
        const diffTime = Math.abs(today - lastActiveDay);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
            user.streak += 1;
        } else if (diffDays > 1) {
            user.streak = 1;
        }
    }
    user.lastActiveDate = now;
    await user.save();

    res.status(200).json({ success: true, data: session, streak: user.streak });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fail/Reflect a session
// @route   POST /api/sessions/:id/reflect
const reflectSession = async (req, res) => {
  try {
    const { reflection } = req.body;
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    const now = new Date();
    const timeSpent = session.startedAt ? Math.floor((now - session.startedAt) / 1000) : 0;

    session.status = "failed";
    session.completedAt = now;
    session.timeSpent = timeSpent;
    session.reflection = reflection || "No reflection provided";
    
    await session.save();

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard analytics & active/planned sessions
// @route   GET /api/sessions/dashboard
const getDashboard = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter(s => new Date(s.createdAt) >= today);
    const plannedForToday = todaySessions.filter(s => s.status === "planned");
    const activeSession = todaySessions.find(s => s.status === "active");
    const completedToday = todaySessions.filter(s => s.status === "completed");
    
    const totalFocusTimeToday = completedToday.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
    const totalCompleted = sessions.filter(s => s.status === "completed").length;
    const totalFocusTime = sessions.filter(s => s.status === "completed").reduce((sum, s) => sum + (s.timeSpent || 0), 0);
    const user = await User.findById(req.user._id);

    const recentReflections = sessions
      .filter(s => s.status === "failed" && s.reflection)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        planned: plannedForToday,
        active: activeSession || null,
        recentReflections,
        stats: {
          streak: user.streak || 0,
          completedToday: completedToday.length,
          totalFocusTimeToday,
          totalCompleted,
          totalFocusTime,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  planDay,
  addSubtasks,
  startSession,
  completeSession,
  reflectSession,
  getDashboard,
};
