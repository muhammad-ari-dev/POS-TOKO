import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "Akses ditolak. Token tidak ada." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // bisa digunakan nanti (misalnya user id)
    next();
  } catch (err) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};
