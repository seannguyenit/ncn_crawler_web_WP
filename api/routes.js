'use strict';
module.exports = function (app) {
  let accCtrl = require('./controllers/user_controller');
  let menuCtrl = require('./controllers/menu_controller');
  let fake_requestCtrl = require('./controllers/fake_request_controller');
  let toolCtrl = require('./controllers/tool_controller');
  let fbuidCtrl = require('./controllers/fbuser_controller');
  let slotCtrl = require('./controllers/slot_controller');
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


  app.route('/api/slot')
    .get(slotCtrl.get)
    .post(slotCtrl.store);

  app.route('/api/slot/:id')
    .get(slotCtrl.detail);

  app.route('/api/slot/:id')
    .put(slotCtrl.update)
    .delete(slotCtrl.delete);

  app.route('/api/fbuid')
    .get(fbuidCtrl.get)
    .post(fbuidCtrl.store);

  app.route('/api/fbuid_insertbigdata')
    .post(fbuidCtrl.storeBigData)

  app.route('/api/fbuid_updatebigdata')
    .put(fbuidCtrl.updateBigData);

  app.route('/api/fbuid/checkAccounts')
    .post(fbuidCtrl.getByMultiAcc)

  app.route('/api/fbuid/:id')
    .get(fbuidCtrl.detail);

  app.route('/api/fbuid_slot/:id')
    .get(fbuidCtrl.getBySlotId);

  app.route('/api/fbuid/check/:account')
    .get(fbuidCtrl.getByAcc);

  app.route('/api/fbuid/:id')
    .put(fbuidCtrl.update)
    .delete(fbuidCtrl.delete);

  app.route('/api/menu')
    .get(menuCtrl.get_template);
  app.route('/api/menu/:id')
    .get(menuCtrl.get_by_user);
  app.route('/api/menu_user/:user_id')
    .post(menuCtrl.add_menu);

  app.route('/api/web_info/:type')
    .get(menuCtrl.get_web_info)
    .post(menuCtrl.update_web_info);

  app.route('/api/fproxy')
    .post(fake_requestCtrl.get_url);
  // app.route('/api/fproxy_img')
  //   .post(fake_requestCtrl.get_blob_image);

  app.route('/api/up_image_fromSV')
    .post(fake_requestCtrl.post_image);
};

