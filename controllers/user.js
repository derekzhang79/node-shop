const common = require('../utils/common');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const config = require('../config');

const user = {
  register(req, res) {
    let {username, password} = req.body;
    //:TODO 验证用户名是否已注册
    password = common.generatePassword(password);
    let user = new User({
      username,
      password,
      lastLoginAt: new Date(),
      createdAt: new Date()
    });
    user.save((err, doc) => {
      if (err) {
        return res.json({
          code: 1,
          msg: '注册失败'
        });
      }
      return res.json({
        code: 0,
        msg: '注册成功'
      })
    })
  },
  auth(req, res) {
    let {username, password} = req.body
    User.findOne({ username }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({ code: 2, msg: '认证失败，该用户未注册'});
      }
      if (user.password !== common.generatePassword(password)) {
        return res.json({ code: 3, msg: '认证失败，密码错误'});
      }

      console.log(user);
      const token = jwt.sign({username: user.username}, config.SECRET, {
        expiresIn: '30 days'
      });
      res.json({
        code: 0,
        msg: '认证成功',
        token
      })
    })
  },
  checkUnique(req, res) {

  }
}
module.exports = user