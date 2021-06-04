const tsmbController = require('./api/controllers/tsmbController');

module.exports = function(app) {
    app.route('/popup')
    .get(tsmbController.popup);

    app.route('/api/logs/log_member')
    .all(tsmbController.api_log_member);

    app.route('/v2/login')
    .all(tsmbController.login);

    app.route('/v2/register_mobile')
    .all(tsmbController.register);

    app.route('/privacy')
    .get(tsmbController.privacy);

	// ios api
    app.route('/')
    .all(tsmbController.index);

    app.route('/basic/getUpdate')
    .all(tsmbController.basic);
    
    app.route('/basic/getMaterial')
    .all(tsmbController.basic);

    app.route('/register')
    .post(tsmbController.register_ios);

    app.route('/alt')
    .get(tsmbController.alt);

    app.route('/login')
    .get(tsmbController.login_html);

    app.route('/login')
    .post(tsmbController.login_ios);

    app.route('/alt/login')
    .get(tsmbController.login_xh);

    app.route('/partner/auth')
    .post(tsmbController.partner_auth);

    app.route('/tssy/login/yijiei')
    .post(tsmbController.tssy_login_yijiyei);

    app.route('/tssy/init/yijiei')
    .post(tsmbController.tssy_init_yijiyei);
}