import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "bharat_bhoomi_secure_jwt_secret_key_2024_gov_india";

// Middleware to authenticate JWT token
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication required. Please log in." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
}

// Middleware for officer or admin role
export function requireOfficer(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role === "officer" || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ success: false, message: "Access restricted to authorized Department Officers only." });
    }
  });
}

// Middleware for admin role
export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ success: false, message: "Access restricted to System Administrators only." });
    }
  });
}
