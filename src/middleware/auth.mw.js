const jwt = require('jsonwebtoken');

exports.isLogin = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers['authorization'];
    if (token) {
      const userDecoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = userDecoded.id;
      return next();
    }
    return res.status(403).send({
      success: false,
      message: 'A token is required for authentication',
    });
  } catch (Error) {
    return res.status(403).send({ success: false, message: 'Not authrized' });
  }
};
