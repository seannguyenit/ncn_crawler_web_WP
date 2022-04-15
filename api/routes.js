'use strict';
module.exports = function (app) {
  let accCtrl = require('./controllers/user_controller');
  let menuCtrl = require('./controllers/menu_controller');
  let toolCtrl = require('./controllers/tool_controller');
  // todoList Routes
  app.route('/api/login')
    .post(accCtrl.login);
  app.route('/api/logout')
    .post(accCtrl.logout);

  app.route('/api/Accounts')
    .get(accCtrl.get)
    .post(accCtrl.store);

  app.route('/api/Accounts/:id')
    .get(accCtrl.detail);

  app.route('/api/Accounts/:id')
    .put(accCtrl.update)
    .delete(accCtrl.delete);

  app.route('/api/tool_lib')
    .get(toolCtrl.get)
    .post(toolCtrl.store);

  app.route('/api/tool_lib/:id')
    .get(toolCtrl.detail);

  app.route('/api/tool_lib/:id')
    .put(toolCtrl.update)
    .delete(toolCtrl.delete);

  app.route('/api/menu')
    .get(menuCtrl.get_template);
  app.route('/api/menu/:id')
    .get(menuCtrl.get_by_user);
  app.route('/api/menu_user/:user_id')
    .post(menuCtrl.add_menu);

  app.route('/api/web_info/:type')
    .get(menuCtrl.get_web_info)
    .post(menuCtrl.update_web_info);
};

