const jwt = require("jsonwebtoken");
/**
 * private function generateToken
 * @param user 
 * @param secretSignature 
 * @param tokenLife 
 */
let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = {
      udid: user.udid,
      username: user.username,
      user_id: user.user_id,
      scope: user.scope
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}
/**
 * This module used for verify jwt token
 * @param {*} req: request
 * @param {*} secretKey 
 */
let verifyToken = (req, secretKey) => {
  return new Promise((resolve, reject) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};