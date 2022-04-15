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
  app.route('/home/filter_string')
    .get(homeCtrl.filter_str);
  app.route('/home/dis_string')
    .get(homeCtrl.dis_str);
  app.route('/home/users')
    .get(homeCtrl.user);
  app.route('/home/tool_lib')
    .get(homeCtrl.tool_lib);
    app.route('/home/tool_m')
    .get(homeCtrl.tool_m);
};