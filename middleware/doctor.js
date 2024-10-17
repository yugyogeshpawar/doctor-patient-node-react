const jwt = require("jsonwebtoken");

const doctorVerifyToken = (req, res, next) => {
  const token = req?.headers?.authorization;

  if (!token) {
    return res?.status(401)
      .json({ message: "No token provided, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.doctorId = decoded?.doctorId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { doctorVerifyToken };
