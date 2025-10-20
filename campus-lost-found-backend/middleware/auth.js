// middleware/auth.js

export const protect = (req, res, next) => {
  try {
    // Mock user for testing
    req.user = {
      _id: "64f5mockuser", // use _id, not id
      isVerified: true,
      isAdmin: true,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export const verifiedUser = (req, res, next) => {
  if (!req.user?.isVerified) return res.status(403).json({ message: "User not verified" });
  next();
};

export const admin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin only" });
  next();
};
