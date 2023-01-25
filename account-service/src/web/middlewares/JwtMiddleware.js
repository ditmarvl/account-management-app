module.exports = (req, res, next) => {
  const { jwt, secrets } = req.container.cradle;

  const token = req.headers["x-access-token"];

  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, secrets.secretKey, (error, decoded) => {
    if (error) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }

    // Check if the token has expired
    if (decoded.exp < Date.now() / 1000) {
      return res
        .status(401)
        .send({ auth: false, message: "Token has expired." });
    }

    req.user = decoded;
    return true;
  });

  return next();
};
