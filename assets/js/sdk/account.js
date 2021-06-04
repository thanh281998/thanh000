function close_webview() {
	try {
		window.webkit.messageHandlers.gametv.postMessage(JSON.stringify({'type': 'close_webview'}));
	} catch(err) {
	}
	// if (typeof Android === "undefined") {
	// 	window.location.href = "uniwebview://close";
	// } else Android.setData(JSON.stringify({'type': 'close_webview'}));
}

function facebook_login() {
	try {
		window.webkit.messageHandlers.gametv.postMessage(JSON.stringify({'type': 'login_facebook'}));
	} catch(err) {
	}
	if (typeof Android === "undefined") {
		window.location.href = "uniwebview://fblogin";
	} else Android.setData(JSON.stringify({'type': 'login_facebook'}));
}

function google_login() {
	try {
		window.webkit.messageHandlers.gametv.postMessage(JSON.stringify({'type': 'login_google'}));
	} catch(err) {
	}
	if (typeof Android === "undefined") {
		window.location.href = "uniwebview://gglogin";
	} else Android.setData(JSON.stringify({'type': 'login_google'}));
}
function play_now() {
	try {
		window.webkit.messageHandlers.gametv.postMessage(JSON.stringify({'type': 'play_now'}));
	} catch(err) {
	}
	if (typeof Android === "undefined") {
		window.location.href = "uniwebview://playnow";
	} else Android.setData(JSON.stringify({'type': 'play_now'}));
}

$(function() {

    var startDate = "1970";
    var endDate = new Date().getFullYear() - 1;
    $('#register_birth').datepicker({
        dateFormat: 'dd/mm/yy',
        changeYear: true,
        defaultDate:"-50y-m-d",
        yearRange: startDate+":"+endDate
    });

    $('#login-with-id').click(function () {
        $('#w4vnID').hide();
        $('#login-md').show();
    });
    $('#register-now').click(function () {
        $('#w4vnID').hide();
        $('#register-md').show();
    });
    $('#register-from-login').click(function () {
        $('#login-md').hide();
        $('#register-md').show();
    });
    $('#click-playnow').click(function () {
        // Call login playnow
        play_now();
    });
    $('#click-facebook').click(function () {
        // Call login facebook
        facebook_login();
    });
    $('#click-google').click(function () {
        // Call login google
        google_login();
    });
    /*
    $('#btnLogin').click(function () {
        // Call login GTV

    });
*/

    $('.btnBackHome').click(function () {
        $('#w4vnID').show();
        $('#login-md').hide();
        $('#register-md').hide();
    });

    $('#loginForm').validate({
        errorClass: "invalid",
        validClass: "valid",
        errorPlacement: function(error, element) {
            return false;
        },
        rules: {
            username: {
                required: {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                }
            },
            userpass: {
                required: true,
                minlength: 6
            }
        },
        messages: {},
        submitHandler: function(form) {

            var urlLogin = apiHost + "/v2/login";
            var dataLogin = {
                username: $(form).find('input[name="username"]').val(),
                userpass: $(form).find('input[name="userpass"]').val(),
                service: $(form).find('input[name="service"]').val(),
                referent_id: 1,
                os_id: $(form).find('input[name="os_id"]').val()
            };
            $.ajax({
                type: 'POST',
                url: urlLogin,
                data: dataLogin,
                async: true,
                crossDomain:true,
                success: function (resLogin) {
                    // $("#test_vitti").html(JSON.stringify(resLogin))
                	if(resLogin.status === 'success') {
						var array = {type: 'login_success',user_hash:JSON.stringify(resLogin), uuid:resLogin.uuid, user_id: resLogin.user_id , username: resLogin.username, auth: resLogin.auth, register:0};
						try {
							window.window.webkit.messageHandlers.gametv.postMessage(array);
                            
						} catch (err) {
                            $("#test_vitti").html("error!!!")
						}
						if (typeof Android === "undefined") {
                            const url = "uniwebview://login?uuid=" + resLogin.uuid + "&user_id=" + resLogin.user_id + "&auth=" + JSON.stringify(resLogin.auth) + "&register=0&user_hash=" + JSON.stringify(resLogin);
                            $("#test_vitti").html(url)
							//window.location.href = "uniwebview://login?user_hash=" + resLogin.user_hash + "&register=0";
                            
							window.location.href = url
						} else Android.setData(JSON.stringify(array));
						if (window.opener) window.opener.postMessage(JSON.stringify(array), "*");
					} else if(resLogin.status === 'require_otp') {
                        $('#uuid').val(resLogin.uuid);
                        $('#user_id').val(resLogin.user_id);
                        $('#user_hash').val(resLogin.user_hash);
                        $('#auth').val(JSON.stringify(resLogin.auth));

						if(resLogin.hidden_phone !== "" && resLogin.hidden_phone !== null) {
							$('.sdk-your-phone').html(resLogin.hidden_phone);
                            $('#hidden_phone').val(resLogin.hidden_phone);
							$('#sdkcfhasPhone').removeClass('hidden');
						}
						if(resLogin.hidden_email !== "" && resLogin.hidden_email !== null) {
							$('.sdk-your-email').html(resLogin.hidden_email);
                            $('#hidden_email').val(resLogin.hidden_email);
							$('#sdkcfhasEmail').removeClass('hidden');
						}

						$('#login-md').hide();
						$('#sdk-confirm-login').show();
					} else {
                        alert(resLogin.message)
						Swal.fire({
							icon: 'error',
							title: 'Lỗi!',
							text: resLogin.message,
							confirmButtonText: 'ĐÓNG',
						});
					}
                }
            });
        }
    });
	$('body').on('click', '#send-otp-email', function () {
        var uuid = $('#uuid').val();
        var hidden_email = $('#hidden_email').val();

		$.ajax({
			type: 'post',
			url: apiHost + '/v2/gen_odp',
			data: {
				uuid: uuid,
				type: 'email'
			},
			beforeSend() {
				$('#send-otp-email').html('Đang gửi email..');
			}
		}).done(function (res) {
			setTimeout(function() {
				$('#send-otp-email').html('GỬI EMAIL TỚI ' + hidden_email);
			}, 1000);
			if(res.status === 'success') {

			} else {
				Swal.fire({
					icon: 'error',
					title: 'Đã xảy ra lỗi',
					html: res.message,
					confirmButtonText: 'ĐÓNG',
				});
				$('#send-otp-email').removeAttr('disabled');
			}
		});
	});
	$('body').on('click', '#send-otp-sms', function () {
        var uuid = $('#uuid').val();
        var hidden_phone = $('#hidden_phone').val();

		$.ajax({
			type: 'post',
			url: apiHost + '/v2/gen_odp',
			data: {
				uuid: uuid,
				type: 'sms'
			},
			beforeSend() {
				$('#send-otp-sms').html('Đang gửi SMS..');
			}
		}).done(function (res) {
			setTimeout(function() {
				$('#send-otp-sms').html('GỬI SMS TỚI ' + hidden_phone);
			}, 1000);
			if(res.status === 'success') {

			} else {
				Swal.fire({
					icon: 'error',
					title: 'Đã xảy ra lỗi',
					html: res.message,
					confirmButtonText: 'ĐÓNG',
				});
				$('#send-otp-sms').removeAttr('disabled');
			}
		});
	});
	$('#sdkLoginConfirm').validate({
		rules: {
			sdk_otp_code: { required: true }
		},
		messages: {
			sdk_otp_code: { required: "Vui lòng nhập mã xác thực" }
		},
		submitHandler: function(form) {
			var code = $('input[name="sdk_otp_code"]').val();
			$.ajax({
				type: 'post',
				url: apiHost + '/v2/verify_login_otp',
				data: {
					username: $(form).find('input[name="username"]').val(),
					userpass: $(form).find('input[name="userpass"]').val(),
					uuid: $("#uuid").val(),
					code: code
				},
				crossDomain: true,
				async: true,
				success: function(res) {
					if(res.status === 'success') {
						var user_id = $("#user_id").val();
						var username = $(form).find('input[name="username"]').val();
						var user_hash = $("#user_hash").val();
						var uuid = $("#uuid").val();
						var auth = $("#auth").val();
						var array = {type: 'login_success', uuid: uuid, user_id: user_id, username: username, auth: JSON.parse(auth), register: 0};
						//array = JSON.stringify(array);
						try {
							window.webkit.messageHandlers.gametv.postMessage(array);
						} catch (err) {
						}
						if (typeof Android === "undefined") {
							window.location.href = "uniwebview://login?uuid=" + uuid + "&auth=" + JSON.parse(auth) + "&register=0";
						} else Android.setData(JSON.stringify(array));
						if (window.opener) window.opener.postMessage(JSON.stringify(array), "*");
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Lỗi!',
							text: res.message,
							confirmButtonText: 'ĐÓNG',
						});
					}
				}
			});
		}
	});

    
    $.validator.addMethod("check_date_of_birth", function(value, element) {                 
        var birthday = $("#register_birth").val();
        var parts = birthday.split("/");
        var age =  18;
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        var currdate = new Date();
         currdate.setFullYear(currdate.getFullYear() - age); 
        return currdate > mydate;
    }, "Bạn phải đủ 18 tuổi");
     $('#registerForm').validate({
        errorClass: "invalid",
        validClass: "valid",
        errorPlacement: function(error, element) {
            return false;
        },       
        rules: {
            username: {
                required: {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                }
            },
            birthday: {
                required: true,
                check_date_of_birth:true
            },
            email: {
                required: {
					depends:function(){
						$(this).val($.trim($(this).val()));
						return true;
					}
				},
                email_domain: true
            },
            mobie: {
                required: true,
                minlength: 10
            },
            userpass: { required: true, minlength: 6 },
            confirm_pass: {
                required: true,
                equalTo: '#register-pass'
            },
            reg_captcha: {
                required: true,
                equalTo: '#input-rcaptcha'
            }
        },
        messages: {
            username:"Tên đăng nhập không được để trống",
            mobie:{
                required:"Số điện thoại không được để trống",
                minlength:"Số điện thoại phải lớn hơn hoặc bằng 10 ký tự",
            },
            userpass:{
                required: "Mật khẩu không được để trống",
                minlength:"Mật khẩu phải có ít nhất 6 ký tự",
            },
            confirm_pass:{
                required:"Xác nhận mật khẩu không được để trống",
                equalTo:"Xác nhận mật khẩu không trùng khớp",
            },
            birthday:{
                required:"Ngày sinh không được để trống"
            }
        },
        invalidHandler: function(event, validator) {     
            console.log(validator)   ;    
            var summary = "<div style='text-align: left'>";
            $.each(validator.errorList, function() { summary += " - " + this.message + "</br>"; });
            summary+="</div>"
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                html: summary,
                confirmButtonText: 'ĐÓNG',
            });            
        },
        
        submitHandler: function(form) {
            $.ajax({
                type: 'POST',
                url: apiHost + "/v2/register_mobile",
                data: $(form).serialize(),
                async: true,
                crossDomain:true
            }).done(function (res) {
                if (res.status == 'error') {
                    // $("#registerMessage").html(res.message);
                    // $("#registerMessage").removeClass('hidden');
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        html: res.message,
                        confirmButtonText: 'ĐÓNG',
                    });
                }
                if (res.status == 'success') {
                    //dat cookie
                    var urlLogin = apiHost + "/v2/login";
                    var dataLogin = {
                        username: $(form).find('input[name="username"]').val(),
                        userpass: $(form).find('input[name="userpass"]').val(),
                        service: $(form).find('input[name="service"]').val(),
                        referent_id: 1,
                        os_id: $(form).find('input[name="os_id"]').val()
                    };
                    $.ajax({
                        type: 'POST',
                        url: urlLogin,
                        data: dataLogin,
                        async: true,
                        crossDomain:true,
                        success: function (resLogin) {
                            $("#test_vitti").html(JSON.stringify(resLogin));
                        	if(resLogin.status === 'success') {
								var array = {status: "success", type: 'login_success', uuid:resLogin.uuid, user_id: resLogin.user_id, username: resLogin.username, auth:resLogin.auth, register:1};
								//array = JSON.stringify(array);
								try {
									window.webkit.messageHandlers.gametv.postMessage(array);
                                    $("#test_vitti").html("ios webkit start");
								} catch (err) {
                                    $("#test_vitti").html("ios webkit error"+err.toString());
								}
								if (typeof Android === "undefined") {
                                    // window.location.href = "uniwebview://login?uuid=" + resLogin.uuid + "&user_id=" + resLogin.user_id + "&auth=" + JSON.stringify(resLogin.auth) + "&register=1";
                                    // $("#test_vitti").html("uniwebview start android undefined");
									window.location.href = "uniwebview://login?uuid=" + resLogin.uuid + "&user_id=" + resLogin.user_id + "&auth=" + JSON.stringify(resLogin.auth) + "&register=1";

                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Thành công!',
                                        text: "Đăng ký thành công! Hãy quay lại trang login để đăng nhập nhé",
                                        confirmButtonText: 'ĐÓNG',
                                    });

                                    $("#loginForm #username").val($(form).find('input[name="username"]').val())
                                    $("#loginForm #userpass").val($(form).find('input[name="userpass"]').val())

                                    $("#loginForm #btnLogin").click();
								} else Android.setData(JSON.stringify(array));
								if (window.opener) window.opener.postMessage(JSON.stringify(array), "*");
							} else {
								Swal.fire({
									icon: 'error',
									title: 'Lỗi!',
									text: resLogin.message,
									confirmButtonText: 'ĐÓNG',
								});
							}
                        }
                    });
                }
            });
        }
    });

    $('#mergeForm').validate({
        errorClass: "invalid",
        validClass: "valid",
        errorPlacement: function(error, element) {
            return false;
        },
        rules: {
            username: {
                required: {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                }
            },
            email: {
                required: {
					depends:function(){
						$(this).val($.trim($(this).val()));
						return true;
					}
				},
                email_domain: true
            },
            userpass: { required: true, minlength: 6 },
            confirm_pass: {
                required: true,
                equalTo: '#register-pass'
            },
            reg_captcha: {
                required: true,
                equalTo: '#input-rcaptcha'
            }
        },
        messages: {},
        submitHandler: function(form) {
            $.ajax({
                type: 'POST',
                url: apiHost + "/v2/merge_playnow",
                data: $(form).serialize(),
                async: true,
                crossDomain:true
            }).done(function (res) {
                if (res.status == 'error') {
                    $("#mergeMessage").html(res.message);
                    $("#mergeMessage").removeClass('hidden');
                }
                if (res.status == 'success') {
                    //dat cookie
                    var urlLogin = apiHost + "/v2/login";
                    var dataLogin = {
                        username: $(form).find('input[name="username"]').val(),
                        userpass: $(form).find('input[name="userpass"]').val(),
                        service: 1,
                        referent_id: 1,
                        os_id: 0
                    };
                    $.ajax({
                        type: 'POST',
                        url: urlLogin,
                        data: dataLogin,
                        async: true,
                        crossDomain:true,
                        success: function (resLogin) {
                            if(resLogin.status === 'success') {
								var array = {type: 'login_success', uuid:resLogin.uuid, user_id: resLogin.user_id, username: resLogin.username, auth: resLogin.auth, register:0};
								try {
									window.webkit.messageHandlers.gametv.postMessage(array);
								} catch (err) {
								}
								if (typeof Android === "undefined") {
									window.location.href = "uniwebview://login?uuid=" + resLogin.uuid + "&user_id=" + resLogin.user_id + "&auth=" + resLogin.auth + "&register=0";
								} else Android.setData(JSON.stringify(array));
								if (window.opener) window.opener.postMessage(JSON.stringify(array), "*");
                            } else {
                                alert(resLogin.message)
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Lỗi!',
                                    text: resLogin.message,
                                    confirmButtonText: 'ĐÓNG',
                                });
                            }
                        }
                    });
                }
            });
        }
    });


    $('body').on('click', '.history-item', function() {
        $('.history-item').removeClass('active');
        $(this).addClass('active');
        var trans = $(this).attr('data-trans');
        var money = $(this).attr('data-money');
        // alert(trans);
        if($(this).hasClass('active')) {
            // danh dau lich su nap
            $('.list-package li').removeClass('active');
            $('input:radio[name=charged]').filter('[value="'+trans+'"]').prop('checked', true);

            // danh dau server & nhan vat
            // .....

            // danh dau goi nap
            $('.list-package li').filter('[data-coin="50"]').addClass('active');
            $('input:radio[name=package_money]').filter('[value="'+money+'"]').prop('checked', true);

            // danh dau the nap
            $('.card-item').removeClass('active');
            $('.methods .card-item').filter('[data-port="'+trans+'"]').addClass('active');
            $('input:radio[name=port_checkout]').filter('[value="'+trans+'"]').prop('checked', true);
            if(trans != null && trans != 'onepay') $('.card-info').removeClass('hidden');
            else $('.card-info').addClass('hidden');
        }

        // kiem tra gia tri co dc danh dau ko
        let checkval = $('input[name=charged]:checked').val();
    });

});
//apple login

function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}
// var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

var rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyz');

AppleID.auth.init({
	clientId : clientId,
	scope : 'name email',
	redirectURI : redirectURI,
	state : rString,
	response_mode: 'form_post',
	usePopup : false //or false defaults to false
});
