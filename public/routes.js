'use strict';

module.exports = function (app) {
  let homeCtrl = require('./controllers/HomeController');
  let auth_Ctrl = require('./controllers/AuthenController');

  // todoList Routes
  app.route('/login')
    .get(auth_Ctrl.get_login_page);
  app.route('')
    .get(homeCtrl.notice);

  // app.route('')
  //   .get(homeCtrl.get);

  app.route('/home/notice')
    .get(homeCtrl.notice);
  app.route('/home/get_content')
    .get(homeCtrl.content);
  app.route('/home/users')
    .get(homeCtrl.user);
};