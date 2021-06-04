const https = require('https');

const fs   = require('fs');

const { v4: uuidv4 } = require('uuid');

const users = require("../../models/tsmb/users")

const jwtHelper = require("../../helper/jwt.helper");

const path = require('path');

const moment = require("moment");

const apiAdapter = require('../../helper/apiAdapter')

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "86400";

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-vitti-green-cat-a@";

// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-example-vitti-green-cat-b@";

module.exports = {
    login: async (req, res) => {
        // if(!req.useragent.isMobile) {
        //     return res.json({
        //         status: 'flagerro',
        //         message: "FUCK YOU BABY!"
        //     });
        // }
        console.log('login', req.headers);

        if(!req.body.username || !req.body.userpass || !req.body.service || !req.body.referent_id || !req.body.os_id) {
            return res.json({
                status: 'flagerro',
                message: "Hãy nhập đầy đủ thông tin nhé!"
            });
        }

        const username = req.body.username;
        const userpass = req.body.userpass;
        const service = req.body.service;
        const referent_id = req.body.referent_id;
        const os_id = req.body.os_id;

        var user = await users.findOne({
            where: {
                username: username
            }
        });

        if(user === null) {
            return res.status(200).json({
                status: 'error',
                message: "Tài khoản không tồn tại!"
            });
        }

        if(user.password != userpass) {
            return res.status(200).json({
                status: 'error',
                message: "Mật khẩu không đúng!"
            });
        }

        let userDataAccount = {
            uuid: user.uuid,
            username: username,
            user_id: user.id,
            scope: "account"
        };

        let userDataPayment = {
            uuid: user.uuid,
            username: username,
            user_id: user.id,
            scope: "payment"
        };

        let userData = {
            uuid: user.uuid,
            username: username,
            user_id: user.id,
            scope: "user_hash"
        }

        const accessTokenAccount = await jwtHelper.generateToken(userDataAccount, accessTokenSecret, accessTokenLife);
        const accessTokenPayment = await jwtHelper.generateToken(userDataPayment, accessTokenSecret, accessTokenLife);
    
        const refreshTokenAccount = await jwtHelper.generateToken(userDataAccount, refreshTokenSecret, refreshTokenLife);
        const refreshTokenPayment = await jwtHelper.generateToken(userDataPayment, refreshTokenSecret, refreshTokenLife);

        const user_hash = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

        // lưu lại refresh token
        user.update({
            refresh_token_account: refreshTokenAccount,
            refresh_token_payment: refreshTokenPayment
        }).catch(err => {
            console.error(err.toString());
        });

        return res.json({
            status: "success",
            message: "Đăng nhập thành công!",
            uuid: user.uuid,
            username: username,
            user_id: user.id,
            auth: {
                account: {
                    access_token: accessTokenAccount,
                    expires_in: accessTokenLife,
                    token_type: "Bearer",
                    scope: "account",
                    refresh_token: refreshTokenAccount
                },
                payment: {
                    access_token: accessTokenPayment,
                    expires_in: accessTokenLife,
                    token_type: "Bearer",
                    scope: "payment",
                    refresh_token: refreshTokenPayment
                }
            },
            user_hash: user_hash,
            user_money: user.user_money
        });

    },
    register: async (req, res) => {
        // if(!req.useragent.isMobile) {
        //     return res.json({
        //         status: 'flagerro',
        //         message: "FUCK YOU BABY!"
        //     });
        // }
        console.log('register', req.headers);
        if(!req.body.username || !req.body.userpass || !req.body.confirm_pass || !req.body.service || !req.body.referent_id || !req.body.os_id || !req.body.mobie) {
            return res.json({
                status: 'error',
                message: "Hãy nhập đầy đủ thông tin nhé!"
            });
        }

        const username = req.body.username;
        const userpass = req.body.userpass;
        const confirm_pass = req.body.confirm_pass;
        const service = req.body.service;
        const referent_id = req.body.referent_id;
        const os_id = req.body.os_id;
        const mobile = req.body.mobie;
        const cmt = req.body.cmt;
        const cmt_no = req.body.cmt_no;
        const birthday = req.body.birthday;
        const address = req.body.address;

        // kiểm tra password rỗng

        // kiểm tra 2 pass đã giống nhau chưa
        if(userpass != confirm_pass) {
            return res.json({
                status: "error",
                message: "Password không giống nhau!"
            });
        }

        // kiểm tra user tồn tại chưa
        let user = await users.findOne({
            where: {
                username: username
            }
        });

        if(user!=null) {
            return res.json({
                status: "error",
                message: "Username đã tồn tại!"
            });
        }

        let user_created = await users.create({
            username: username,
            password: userpass,
            mobile: mobile,
            cmt: cmt,
            cmt_no: cmt_no,
            birthday: birthday,
            address: address,
            os_id: os_id,
            referent_id: referent_id,
            service: service,
            uuid: uuidv4()
        });

        let userDataAccount = {
            uuid: user_created.uuid,
            username: username,
            user_id: user_created.id,
            scope: "account"
        };

        let userDataPayment = {
            uuid: user_created.uuid,
            username: username,
            user_id: user_created.id,
            scope: "payment"
        };

        let userData = {
            uuid: user_created.uuid,
            username: username,
            user_id: user_created.id,
            scope: "user_hash"
        }

        const accessTokenAccount = await jwtHelper.generateToken(userDataAccount, accessTokenSecret, accessTokenLife);
        const accessTokenPayment = await jwtHelper.generateToken(userDataPayment, accessTokenSecret, accessTokenLife);
    
        const refreshTokenAccount = await jwtHelper.generateToken(userDataAccount, refreshTokenSecret, refreshTokenLife);
        const refreshTokenPayment = await jwtHelper.generateToken(userDataPayment, refreshTokenSecret, refreshTokenLife);

        const user_hash = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

        // lưu lại refresh token
        user_created.update({
            refresh_token_account: refreshTokenAccount,
            refresh_token_payment: refreshTokenPayment
        }).catch(err => {
            console.error(err.toString());
        });

        res.json({
            status: "success",
            message: "Tạo tài khoản thành công",
            uuid: user_created.uuid,
            username: username,
            user_id: user_created.id,
            auth: {
                account: {
                    access_token: accessTokenAccount,
                    expires_in: accessTokenLife,
                    token_type: "Bearer",
                    scope: "account",
                    refresh_token: refreshTokenAccount
                },
                payment: {
                    access_token: accessTokenPayment,
                    expires_in: accessTokenLife,
                    token_type: "Bearer",
                    scope: "payment",
                    refresh_token: refreshTokenPayment
                }
            },
            user_hash: user_hash,
            user_money: 0
        });
    },

    popup: (req, res) => {
        // if(!req.useragent.isMobile) {
        //     return res.json({
        //         status: 'flagerro',
        //         message: "FUCK YOU BABY!"
        //     });
        // }

        return res.sendFile(path.join(__dirname+'../../../html/popup.html'));
    },

    privacy: (req, res) => {
        res.sendFile(path.join(__dirname+'../../../html/privacy.html'));
    },

    // ios api
    index: async (req, res) => {
        if(req.query.method) {
            switch(req.query.method) {
                case "user.init":
                    res.json({
                        "state": 1,
                        "2a076": 89844,
                        "03fb2": 60314,
                        "data": {
                            "is_flow_win": "1",
                            "style": "1",
                            "is_openlogin": "",
                            "service_phone": "020-85656973",
                            "service_email": "3433898559@qq.com",
                            "service_time": "8:00-24:00",
                            "game_version": "",
                            "is_change_vedio": 0,
                            "h5_sdk_version": "",
                            "game_forum_url": "",
                            "make_bug": "0",
                            "mandatory_update_tips": {
                                "status": 0,
                                "msg_content": "",
                                "button_link": "",
                                "button_msg": ""
                            },
                            "red_pack": 0,
                            "is_sh": "0",
                            "login_sort": [{
                                "name": "\u5feb\u901f\u767b\u5f55",
                                "logo": 1,
                                "position": 1,
                                "icon": 0
                            }, {
                                "name": "\u624b\u673a\u767b\u5f55",
                                "logo": 2,
                                "position": 2,
                                "icon": 0
                            }, {
                                "name": "\u8d26\u53f7\u767b\u5f55",
                                "logo": 3,
                                "position": 3,
                                "icon": 0
                            }]
                        }
                    });
                    break;
            }
        }
    },

    basic: (req, res) => {
        const BASE_URL = 'https://sdk2.99maiyou.com'
        const api = apiAdapter(BASE_URL)
        api.post(req.path, req.body).then(resp => {
            res.send(resp.data)
        })
    },

    register_ios: async (req, res) => {
        if(!req.body.username || !req.body.password || !req.body.password_repeat) {
            return res.json({
                "status": {
                    "succeed": 0,
                    "error_code": "-9",
                    "error_description": "Hãy nhập đủ thông tin nhé"
                },
                "data": null
            })
        }
        const username = req.body.username
        const password = req.body.password
        const password_repeat = req.body.password_repeat

        if(req.body.password != req.body.password_repeat) {
            return res.json({
                "status": {
                    "succeed": 0,
                    "error_code": "-9",
                    "error_description": "Hai password không giống nhau!"
                },
                "data": null
            })
        }

        // kiểm tra user tồn tại chưa
        let user = await users.findOne({
            where: {
                username: username
            }
        });

        if(user!=null) {
            return res.json({
                "status": {
                    "succeed": 0,
                    "error_code": "-9",
                    "error_description": "Username đã tồn tại, vui lòng nhập lại"
                },
                "data": null
            })
        }

        let user_created = await users.create({
            username: username,
            password: userpass,
            mobile: mobile,
            cmt: cmt,
            cmt_no: cmt_no,
            birthday: birthday,
            address: address,
            os_id: os_id,
            referent_id: referent_id,
            service: service,
            uuid: uuidv4()
        });

        let userDataAccount = {
            uuid: user_created.uuid,
            username: username,
            user_id: user_created.id,
            scope: "account"
        };

        let userDataPayment = {
            uuid: user_created.uuid,
            username: username,
            user_id: user_created.id,
            scope: "payment"
        };

        let userData = {
            uuid: user_created.uuid,
            username: username,
            user_id: user_created.id,
            scope: "user_hash"
        }

        const accessTokenAccount = await jwtHelper.generateToken(userDataAccount, accessTokenSecret, accessTokenLife);
        const accessTokenPayment = await jwtHelper.generateToken(userDataPayment, accessTokenSecret, accessTokenLife);
    
        const refreshTokenAccount = await jwtHelper.generateToken(userDataAccount, refreshTokenSecret, refreshTokenLife);
        const refreshTokenPayment = await jwtHelper.generateToken(userDataPayment, refreshTokenSecret, refreshTokenLife);

        const user_hash = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

        // lưu lại refresh token
        user_created.update({
            refresh_token_account: refreshTokenAccount,
            refresh_token_payment: refreshTokenPayment
        }).catch(err => {
            console.error(err.toString());
        });

        return res.json({
            "status": {
                "succeed": 1
            },
            "data": {
                "username": username,
                "sign": accessTokenAccount,
                "logintime": moment(user_created.createdAt).unix(),
                "token": refreshTokenAccount
            }
        });
    },

    login_ios: async (req, res) => {
        if(!req.body.username || !req.body.password) {
            return res.json({
                "status": {
                    "succeed": 0,
                    "error_code": "-9",
                    "error_description": "Thiếu thông tin"
                },
                "data": null
            })
        }

        const username = req.body.username
        const password = req.body.password
        const gameid = req.body.gameid

        var user = await users.findOne({
            where: {
                username: username
            }
        });

        if(user === null) {
            return res.status(200).json({
                "status": {
                    "succeed": 0,
                    "error_code": "-9",
                    "error_description": "Tài khoản không tồn tại"
                },
                "data": null
            });
        }

        if(user.password != password) {
            return res.status(200).json({
                "status": {
                    "succeed": 0,
                    "error_code": "-9",
                    "error_description": "Sai mật khẩu"
                },
                "data": null
            });
        }

        let userDataAccount = {
            uuid: user.uuid,
            username: username,
            user_id: user.id,
            scope: "account"
        };

        let userDataPayment = {
            uuid: user.uuid,
            username: username,
            user_id: user.id,
            scope: "payment"
        };

        let userData = {
            uuid: user.uuid,
            username: username,
            user_id: user.id,
            scope: "user_hash"
        }

        const accessTokenAccount = await jwtHelper.generateToken(userDataAccount, accessTokenSecret, accessTokenLife);
        const accessTokenPayment = await jwtHelper.generateToken(userDataPayment, accessTokenSecret, accessTokenLife);
    
        const refreshTokenAccount = await jwtHelper.generateToken(userDataAccount, refreshTokenSecret, refreshTokenLife);
        const refreshTokenPayment = await jwtHelper.generateToken(userDataPayment, refreshTokenSecret, refreshTokenLife);

        const user_hash = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

        // lưu lại refresh token
        user.update({
            refresh_token_account: refreshTokenAccount,
            refresh_token_payment: refreshTokenPayment
        }).catch(err => {
            console.error(err.toString());
        });

        req.session.token = refreshTokenAccount;
        req.session.username = username;

        res.json({
            "status": {
                "succeed": 1
            },
            "data": {
                "username": username,
                "sign": accessTokenAccount,
                "logintime": moment(user.updatedAt).unix(),
                "token": refreshTokenAccount,
                "authentication": 1
            }
        })
    },

    alt: async (req, res) => {
        const token = req.session.token

        const user = users.findOne({
            where: {
                refresh_token_account: token
            }
        });

        res.json({
            "member": {
                "is_bohui": 0,
                "isAdult": false,
                "username": user.username,
                "reg_time": moment(user.updatedAt).unix(),
                "lastlogintime": `${moment(user.updatedAt).unix()}`,
                "token": `${token}`,
                "isTest": false,
                "loginTimes": "3",
                "monthcard": null,
                "is985": false
            },
            "alts": [{
                "xh_id": user.uuid,
                "xh_username": `msa_${moment(user.createdAt).unix()}_Wvtl`,
                "master_id": user.id,
                "alias": "小号1",
                "create_agent": "e5jj",
                "game_id": 3285,
                "create_time": moment(user.createdAt).unix(),
                "status": 1,
                "login_time": moment().unix(),
                "is_tradable": 1,
                "tradable_time": 0
            }],
            "news": {
                "newid": null,
                "categoryid": "4",
                "categorypid": "0",
                "logo": "",
                "title": "（6月5日-6月7日）天使圣域",
                "description": "【限时活动】活动一：多日累充活动时间：6月5日-6月7日活动规则：活动期间累计充值达对应额度即可领取奖励，高档位累冲额度激活时，可同时领取低额度奖励累充100元：魔宠精华*200、叮叮当儿相框*5累充200元：魔宠精华*400、天使契约*10、熔岩爆裂*1累充500元：魔宠精华*600、3倍经验药水*1、天使契约*20累充1000元：魔宠精华*800、天使契约*40、圣诞恋歌套装*1累充2000元：魔宠精",
                "isrecommend": "0",
                "viewnum": "208",
                "weeknum": "0",
                "daynum": "0",
                "isverify": "3",
                "displayorder": "0",
                "type": "4",
                "dateline": "1591261959",
                "deadline": "0",
                "is_maiyou": "1",
                "act_title": "",
                "act_type": "",
                "sourceurl": "",
                "isad": "0",
                "adpic": "",
                "serverid": "0",
                "isphone": "0",
                "ispad": "0",
                "isdownloadimg": "0",
                "isdownloadpic": "0",
                "appid": null,
                "message": "",
                "prop": "",
                "content": "<p style=\"text-align: left;\">【限时活动】</p><p style=\"text-align: left;\">活动一：多日累充</p><p style=\"text-align: left;\">活动时间：6月5日-6月7日</p><p style=\"text-align: left;\">活动规则：活动期间累计充值达对应额度即可领取奖励，高档位累冲额度激活时，可同时领取低额度奖励</p><p style=\"text-align: left;\">累充100元：魔宠精华*200、叮叮当儿相框*5</p><p style=\"text-align: left;\">累充200元：魔宠精华*400、天使契约*10、熔岩爆裂*1</p><p style=\"text-align: left;\">累充500元：魔宠精华*600、3倍经验药水*1、天使契约*20</p><p style=\"text-align: left;\">累充1000元：魔宠精华*800、天使契约*40、圣诞恋歌套装*1</p><p style=\"text-align: left;\">累充2000元：魔宠精华*1000、5倍经验药水*1、天使契约*60</p><p style=\"text-align: left;\">累充3000元：魔宠精华*1500、5倍经验药水*2、天使碎片选择宝箱*2</p><p style=\"text-align: left;\">累充5000元：魔宠精华*2000、碎片选择箱II*1、终极铭文选择箱（140400001）*1</p><p style=\"text-align: left;\">累充10000元：魔宠精华*3000、碎片选择箱II*2、终极铭文选择箱（140400002）*1</p><p style=\"text-align: left;\">终极铭文选择箱（140400001）：使用后可自主选择终极防御铭文 *1、终极攻击铭文*1、终极生命铭文*1之一</p><p style=\"text-align: left;\">终极铭文选择箱（140400002）：使用后可自主选择终极防具防御铭文*1、终极武器攻击铭文*1、终极首饰攻击铭文*1之一</p><p style=\"text-align: left;\">活动二：单日循环充值</p><p style=\"text-align: left;\">活动时间：6月5日-6月7日</p><p style=\"text-align: left;\">活动规则：活动期间，每累计充值满一定金额即可领取奖励，累充金额次日重置</p><p style=\"text-align: left;\">每累充50元：生命神兵石（大）*20</p><p style=\"text-align: left;\">活动三：充值返利</p><p style=\"text-align: left;\">活动时间：6月5日-6月7日</p><p style=\"text-align: left;\">（与常驻充值返利不叠加）</p><p style=\"text-align: left;\">活动规则：单日每日累计充值达对应累冲范围即可领取对应返利比例的元宝，最高返利可达400%</p><p style=\"text-align: left;\">单日累充100-499元：返利70%元宝</p><p style=\"text-align: left;\">单日累充500-999元：返利150%元宝</p><p style=\"text-align: left;\">单日累充1000-2999元：返利200%元宝</p><p style=\"text-align: left;\">单日累充3000-4999元：返利250%元宝</p><p style=\"text-align: left;\">单日累充5000-9999元：返利300%元宝</p><p style=\"text-align: left;\">单日累充10000元及以上：返利400%元宝</p>",
                "seotitle": "",
                "seokeyword": "",
                "seodescription": ""
            },
            "compensate": null,
            "is_open": 2
        })
    },

    login_html: (req, res) => {
        return res.sendFile(path.join(__dirname+'../../../html/login_ios.html'));
    },

    partner_auth: (req, res) => {
        res.json({
            "state": 1,
            "code": 0,
            "msg": "",
            "data": {
                "user_id": moment().unix(),
                "username": "u49383053",
                "nick_name": "u49383053",
                "token": "0950cb1c2feb5947c544ddc6306d3c0e",
                "sdk_token": "MTE2NTIwMTAwfHU0OTM4MzA1M3x1NDkzODMwNTN8MTYwNTg5MDAyM3w1MWRlMzhlYjBjNWNiNjFhYzdkMTdiZTA2ZWI2MDZmM3w2",
                "id_check": "0",
                "idno_state": 0,
                "open_id_check": 0,
                "user_type": "6",
                "bind_phone": "0",
                "bind_username": 0,
                "phone": "",
                "n_open_check_idcard": 0,
                "is_check_id_card_type": "0",
                "reanl_info": {
                    is_kick_off: 0
                },
                "is_newuser": 1,
                "openid": "17202279"
            }
        });
    },

    tssy_init_yijiyei: (req, res) => {
        res.json({
            "errno": 0,
            "errmsg": "success"
        });
    },

    login_xh: async (req, res) => {
        const username = req.session.username
        const token = req.session.token

        const userData = {
            username: username,
            token: token
        }

        const user_hash = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);
        res.json({"status":1,"sign":user_hash});
    },

    tssy_login_yijiyei: async (req, res) => {
        const sess = req.body.sess
        const uin = req.body.uin
        let buff = new Buffer(sess, 'base64');
        let text = buff.toString('ascii');

        let textAr = text.split("##")

        const uid = textAr[0];
        const user_id = textAr[1];
        let token = textAr[2];

        token = token.substring(0, token.length-5);

        const user_data = {
            user_id: user_id,
            token: token
        }

        const user_token = await jwtHelper.generateToken(user_data, refreshTokenSecret, refreshTokenLife);

        res.json({
            "result": true,
            "data": {
                "uid": uid,
                "user_name": uid,
                "token": token,
                "user_token": user_token
            },
            "error": {
                "id": 0,
                "message": ""
            }
        })
    },

    api_log_member: (req, res) => {
        res.json({
            status: "success"
        })
    }
}