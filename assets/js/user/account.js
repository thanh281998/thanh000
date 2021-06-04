function onSignInClicked() {
    auth2.signIn().then(function (googleUser) {
        onSignIn(googleUser);
    });
}
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    var uuid = getCookie('user_id');
    if(!uuid) {
        $.ajax({
            url: apiHost + "/v2/google/login", data:{token: id_token, service_id: 1},
            type:"GET", crossDomain: true,
            beforeSend: function(xhr) {},
            error : function(xhr, status){},
            success : function (data) {
                if(data.status=='success') {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
						timer: 600,
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    Toast.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công'
                    });

                    // var time = Date.now() + data.auth.account.expires_in;
                    setCookie('user_id', data.uuid, data.auth.account.expires_in);
                    setCookie('username', data.username, data.auth.account.expires_in);
                    setCookie('access_token', data.auth.account.access_token, data.auth.account.expires_in);
                    setCookie('payment_token', data.auth.payment.access_token, data.auth.payment.expires_in);
                    setTimeout(function () {
                        if(sessionStorage.getItem('charge_url_redirect') !== null){
							var charge_url_redirect=sessionStorage.getItem('charge_url_redirect');
							var current_token = data.auth.account.access_token;
							$.ajax({
								type: 'post',
								url: apiHost + '/v2/data/hash_game_token',
								data: {token:current_token},
								crossDomain: true,
								async: true,
								success: function(res) {
									if(res.status === 'success') {
										if(charge_url_redirect.indexOf("?") != -1){
											window.top.location.href=charge_url_redirect+"&token="+current_token+"&valid_to="+res.valid_to+"&sign="+res.token;
										} else{
											window.top.location.href=charge_url_redirect+"?token="+current_token+"&valid_to="+res.valid_to+"&sign="+res.token;
										}
									} else {
										alert('Xảy ra lỗi');
									}
								}
							});
						}
						else {
							window.location.href= "/";
						}
                    }, 600);
                } else {
                    var txt = '<ul class="list-unstyled">';
                    txt += "<li>" + data.message + "</li>";
                    txt += "</ul>";
                    showError('GTV ID', txt, true);
                }
            }
        });
    }
    return false;
}
function facebook_login(res, service) {
    var accessToken = res.authResponse.accessToken;
    $.ajax({
        url: apiHost + "/v2/facebook/login", data:{token: accessToken, service_id: service},
        type:"GET", crossDomain: true,
        beforeSend: function(xhr) {},
        error : function(xhr, status){},
        success : function (data) {
            if(data.status=='success') {
				const Toast = Swal.mixin({
					toast: true,
					position: 'top',
					showConfirmButton: false,
					timer: 600,
					timerProgressBar: true,
					onOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer)
						toast.addEventListener('mouseleave', Swal.resumeTimer)
					}
				});

				Toast.fire({
					icon: 'success',
					title: 'Đăng nhập thành công'
				});

				// var time = Date.now() + data.auth.account.expires_in;
				setCookie('user_id', data.uuid, data.auth.account.expires_in);
				setCookie('username', data.username, data.auth.account.expires_in);
				setCookie('access_token', data.auth.account.access_token, data.auth.account.expires_in);
				setCookie('payment_token', data.auth.payment.access_token, data.auth.payment.expires_in);
				setTimeout(function () {
					if(sessionStorage.getItem('charge_url_redirect') !== null){
						var charge_url_redirect=sessionStorage.getItem('charge_url_redirect');
						var current_token = data.auth.account.access_token;
						$.ajax({
							type: 'post',
							url: apiHost + '/v2/data/hash_game_token',
							data: {token:current_token},
							crossDomain: true,
							async: true,
							success: function(res) {
								if(res.status === 'success') {
									if(charge_url_redirect.indexOf("?") != -1){
										window.top.location.href=charge_url_redirect+"&token="+current_token+"&valid_to="+res.valid_to+"&sign="+res.token;
									} else{
										window.top.location.href=charge_url_redirect+"?token="+current_token+"&valid_to="+res.valid_to+"&sign="+res.token;
									}
								} else {
									alert('Xảy ra lỗi');
								}
							}
						});
					}
					else {
						window.location.href= "/";
					}
				}, 600);
            } else {
				var txt = '<ul class="list-unstyled">';
				txt += "<li>" + data.message + "</li>";
				txt += "</ul>";
				showError('GTV ID', txt, true);
            }
        }
    });
    return false;
}
var uuid = getCookie('user_id');
if(uuid) {
	$.ajax({
		type: 'POST',
		url: apiHost + '/v2/info',
		data:  {
			uuid: uuid
		},
		async: true,
		crossDomain:true,
		headers: {
			"Authorization": "Bearer " + getCookie('access_token')
		},
		dataType:"json"
	}).done(function(res) {
		// Side bar
		if(res.data.balance.length > 0 && res.data.balance !== undefined) {
			$.each(res.data.balance, function () {
				if(this.currency_type == 1) {
					$('.point-balance').html(moneyFormat(this.balance));
					$('.m-point-balance').html(moneyFormat(this.balance));
				}
			});
		} else {
			$('.point-balance').html(moneyFormat(0));
			$('.m-point-balance').html(moneyFormat(0));
		}
		// Profile page

		var data = res.data;
		if(typeof data === 'string' || data instanceof String) {
			data = JSON.parse(data);
		}

		var general = data.basic_info;
		var profile = data.profile;
		var balance = data.balance;
		userFbData = data.user_fb;
		userGgData = data.user_gg;
		$('input[name=gtv_id]').val(general.gtv_user_id);
		$('.info-username').html(general.username);
		if(general.nickname) $('.info-username').html(general.nickname);
		if(balance.length > 0 && balance !== undefined) {
			$.each(balance, function () {
				if(this.currency_type == 1) {
					$('.num-coin').html(moneyFormat(this.balance));
					$('.point-balance').html(moneyFormat(this.balance));
					$('.m-point-balance').html(moneyFormat(this.balance));
					return false;
				}
			});
		} else {
			$('.num-coin').html('0');
			$('.point-balance').html(moneyFormat(0));
			$('.m-point-balance').html(moneyFormat(0));
		}

		$('.profile-email').html((general.email ? general.email : 'Chưa có'));

		$("#email").val(general.email);

		$('.profile-mobile').html((general.mobile ? general.mobile : 'Chưa có'));
		if(general.is_email_verified == 1 || general.email == null) {
			$('.email-update').removeClass('hidden');
			$('.email-verify').addClass('hidden');
		}
		if(general.is_mobile_verified == 1) {
			$('.phone-verify').attr('data-toggle', 'collapse');
			$('.phone-verify').attr('data-target', '#form-change-phone');
			$('.phone-verify').html('Thay đổi');
			$('.phone-verify').css('cursor', 'pointer');
		}
		if(general.fb_user_id !== null || typeof general.fb_user_id === undefined) {
			$('.facebook-connect-info').html('Bạn đang kết nối với tài khoản <b>' + data.user_fb.fb_name + '</b>');
			$('#is-connect-fb').html('Hủy kết nối tài khoản');
			$('#is-connect-fb').removeClass('bind-facebook');
			$('#is-connect-fb').addClass('unbind-facebook');
		} else {
			$('#is-connect-fb').html('Kết nối tài khoản');
		}
		// form
		if(profile != null) {
			$('.info-id').html('ID: ' + profile.user_id);
			$('input[name="fullname"]').val(profile.fullname);
			if(profile.birthday) {
				var arrBirth = profile.birthday.split("-");
				$("#fBirthday").val(arrBirth[2] + '/' + arrBirth[1] + '/' + arrBirth[0]);
			}

			if(profile.gender == 1) $('#gender option[value="1"]').attr('selected','selected');
			else if(profile.gender == 2) $('#gender option[value="2"]').attr('selected','selected');
			else if(profile.gender == 0) $('#gender option[value="0"]').attr('selected','selected');
			else $('#gender option[value=""]').attr('selected','selected');
			$('input[name="address"]').val(profile.address);
			// $('input[name="city"]').val(profile.city);
			$('#city').val(profile.city);
			$('input[name="job"]').val(profile.job);
			if(profile.married_status == 1) {
				// $('input[name="job"]').val('Độc thân');
				$('#married option[value="1"]').attr('selected','selected');
			} else if(profile.married_status == 2) {
				$('#married option[value="2"]').attr('selected','selected');
			} else $('#married option[value="-1"]').attr('selected','selected');

			if (profile.identification) {
				$("#identification").html(profile.identification);
				$("#fId_no").val(profile.identification);
			} else {
				$("#identification").html('Chưa cập nhật');
			}
			if (profile.identification_date) {
				var date2 = profile.identification_date.substring(8,10);
				var month2 = profile.identification_date.substring(5,7);
				var year2 = profile.identification_date.substring(0,4);
				var formatedBirthday2 =  date2 + "/" + month2 + "/" + year2;
				$("#identification_date").html(formatedBirthday2);
				$("#fId_date").val(formatedBirthday2);
			} else {
				$("#identification_date").html('');
			}

			if (profile.identification_city) {
				$("#fId_city").val(profile.identification_city);

				$("#identification_city").html($( "#fId_city option:selected" ).text());
			} else {
				$("#identification_city").html('');
			}
		} else {
			$("#identification").html('Chưa cập nhật');
		}


		if(data.basic_info.mobile) {
			$('#phone').html(data.basic_info.mobile);
		}
		if(data.user_secure.length == 0) {
			$('.switch-authen').append('Tài khoản chưa bảo mật 2 lớp');
			$('.turnOnAuth2').removeClass('hidden');
			localStorage.setItem('has_two_auth', 0);
			// $('.btn-switch-freeze').addClass('hidden');
		} else {
			var flag = 0;
			$.each(data.user_secure, function () {
				if(this.secure_type_id == 1 && this.is_active == 1) {
					$('.switch-authen').append(' Đã bật bảo mật 2 lớp');
					$('.turnOffAuth2').removeClass('hidden');
					localStorage.setItem('has_two_auth', 1);
					// $('.btn-switch-freeze').removeClass('hidden');
					flag = 1;
					return false;
				}

			});
			if(flag == 0) {
				$('.switch-authen').append('Tài khoản chưa bảo mật 2 lớp');
				$('.turnOnAuth2').removeClass('hidden');
				localStorage.setItem('has_two_auth', 0);
			}

		}
		if(data.basic_info.is_mobile_verified == '1') {
			$("#phone_verified").show();
			$("#need_verify_phone_btn").hide();
		} else {
			$("#phone_verified").hide();
			$("#need_verify_phone_btn").show();
		}

		if(data.basic_info.is_email_verified == '1') {
			$("#email_verified").show();
			$("#need_verify_email_btn").hide();
		} else {
			$("#email_verified").hide();
			$("#need_verify_email_btn").show();
		}

		if(balance.length > 0) {
			if(balance[0] && balance[0].currency_type == 1)
				$('.gpoint-status').html('- Đang sử dụng: ' + moneyFormat(balance[0].balance));
			if(balance[1] && balance[1].currency_type == 3) {
				$('.gpoint-status').append('. Đã đóng băng: ' + moneyFormat(balance[1].balance));
			}

		}

	});
}
$(function() {
    $('#registerForm').validate({
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
				// email: true,
				email_domain: true,
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
			username: { required: "Vui lòng điền tên đăng nhập" },
			email: {
				required: "Vui lòng nhập email",
				email_domain: "Địa chỉ email không hợp lệ"
			},
			userpass: {
				required: "Vui lòng nhập mật khẩu",
				minlength: "Tối thiểu 6 ký tự"
			},
			confirm_pass: {
				required: "Vui lòng xác nhận lại mật khẩu",
				equalTo: "Mật khẩu không khớp"
			},
			reg_captcha: {
				required: "Vui lòng nhập mã bảo vệ",
				equalTo: "Mã bảo vệ không đúng"
			}
		},
        submitHandler: function(form) {
            $.ajax({
				type: 'POST',
				url: apiHost + "/v2/register",
				data: $(form).serialize(),
				async: true,
				crossDomain:true,
				beforeSend() {
					$('#btnRegister').attr('disabled', 'disabled');
				}
            }).done(function (res) {
				$('#btnRegister').removeAttr('disabled');
				if (res.status == 'error') {
					showError('Đã xảy ra lỗi', res.message + "!!!", false);
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
							if (resLogin.status == 'error') {
								showError('Đã xảy ra lỗi!', resLogin.message, false);
							}
							if (res.status == 'require_otp') {
								sessionStorage.setItem('id', res.uuid);
								sessionStorage.setItem('username', $(form).find('input[name="username"]').val());
								sessionStorage.setItem('userpass', $(form).find('input[name="userpass"]').val());

								$("#register-md").modal('hide');
								$("#confirm-login").modal('show');
							}
							if (resLogin.status == 'success') {
								$('#register-md').modal('hide');
								const Toast = Swal.mixin({
									toast: true,
									position: 'top',
									showConfirmButton: false,
									timer: 600,
									timerProgressBar: true,
									onOpen: (toast) => {
										toast.addEventListener('mouseenter', Swal.stopTimer)
										toast.addEventListener('mouseleave', Swal.resumeTimer)
									}
								});

								Toast.fire({
									icon: 'success',
									title: 'W4VN ID: Hệ thống đã ghi nhận tài khoản'
								});

								// var time = Date.now() + resLogin.auth.account.expires_in;
								setCookie('user_id', resLogin.uuid, resLogin.auth.account.expires_in);
								setCookie('username', resLogin.username, resLogin.auth.account.expires_in);
								setCookie('access_token', resLogin.auth.account.access_token, resLogin.auth.account.expires_in);
								setCookie('payment_token', resLogin.auth.payment.access_token, resLogin.auth.payment.expires_in);
								setTimeout(function () {
									if(sessionStorage.getItem('charge_url') !== null) {
										window.location.href  = '/' + sessionStorage.getItem('charge_url');
									} 
									else if(sessionStorage.getItem('charge_url_redirect') !== null){
										var charge_url_redirect=sessionStorage.getItem('charge_url_redirect');
										var new_token = resLogin.auth.account.access_token;
										$.ajax({
											type: 'post',
											url: apiHost + '/v2/data/hash_game_token',
											data: {token:new_token},
											crossDomain: true,
											async: true,
											success: function(res) {
												if(res.status === 'success') {
													if(charge_url_redirect.indexOf("?") != -1){
														window.top.location.href=charge_url_redirect+"&token="+new_token+"&valid_to="+res.valid_to+"&sign="+res.token;
													} else{
														window.top.location.href=charge_url_redirect+"?token="+new_token+"&valid_to="+res.valid_to+"&sign="+res.token;
													}
												} else {
													alert('Xảy ra lỗi');
												}
											}
										});
									}
									else {
										window.location.href= "/";
									}
									
								}, 600);
							}
						}
					});
				}
			});
        }
    });


    var loginTimes = 0;
    $('#loginForm').validate({
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
			},
			log_captcha: {
				required: (loginTimes >= 3 ? true: false),
				equalTo: '#input-lcaptcha'
			}
		},
		messages: {
			username: {
				required: "Vui lòng điền tên đăng nhập"
			},
			userpass: {
				required: "Vui lòng nhập mật khẩu",
				minlength: "Mật khẩu tối thiểu 6 ký tự"
			},
			log_captcha: {
				required: "Vui lòng nhập mã bảo vệ",
				equalTo: "Mã bảo vệ không đúng"
			}
		},
		submitHandler: function(form) {
			// var data = serializeFormJSON(form);
			// data.service = 1;			
			$.ajax({
				type: 'POST',
                url: apiHost + "/v2/login",
                data: $(form).serialize(),
                async: true,
                crossDomain:true,
				beforeSend: function () {
					$('#btnLogin').attr('disabled', 'disabled');
					// showToast('GTV ID', 'Đang xử lý...', 'info');
				}
			}).done(function (res) {
				$('#btnLogin').removeAttr('disabled');
				if (res.status == 'error') {
                    showError('Đã xảy ra lỗi', res.message, false);
					loginTimes += 1;
					if(loginTimes >= 3) {
						loginCaptcha();
						$("#login-web-captcha").removeClass('hidden');
					}
				}
				if (res.status == 'require_otp') {
					sessionStorage.setItem('id', res.uuid);
					sessionStorage.setItem('username', $(form).find('input[name="username"]').val());
					sessionStorage.setItem('userpass', $(form).find('input[name="userpass"]').val());
					if(res.hidden_email !== '') {
						sessionStorage.setItem('useremail', res.hidden_email);
						$('.cf-your-email').html(res.hidden_email);
					} else {
						$('#cfhasEmail').addClass('hidden');
					}
					if(res.hidden_phone !== '') {
						sessionStorage.setItem('userphone', res.hidden_phone);
						$('.cf-your-phone').html(res.hidden_phone);
					} else {
						$('#cfhasPhone').addClass('hidden');
					}

					$("#login-md").modal('hide');
					$("#confirm-login").modal('show');
				}
				if (res.status == 'success') {
					//dat cookie
					$("#login-md").modal('hide');
					const Toast = Swal.mixin({
						toast: true,
						position: 'top',
						showConfirmButton: false,
						timer: 600,
						timerProgressBar: true,
						onOpen: (toast) => {
							toast.addEventListener('mouseenter', Swal.stopTimer)
							toast.addEventListener('mouseleave', Swal.resumeTimer)
						}
					});

					Toast.fire({
						icon: 'success',
						title: 'Đăng nhập thành công'
					});
					// var time = Date.now() + res.auth.account.expires_in;
					setCookie('user_id', res.uuid, res.auth.account.expires_in);
					setCookie('username', res.username, res.auth.account.expires_in);
					setCookie('access_token', res.auth.account.access_token, res.auth.account.expires_in);
					setCookie('payment_token', res.auth.payment.access_token, res.auth.payment.expires_in);
					setTimeout(function () {
						if(sessionStorage.getItem('charge_url') !== null) {
							window.location.href  = '/' + sessionStorage.getItem('charge_url');
						} 
						else if(sessionStorage.getItem('charge_url_redirect') !== null){
							var charge_url_redirect=sessionStorage.getItem('charge_url_redirect');
							var new_token = res.auth.account.access_token;
							$.ajax({
								type: 'post',
								url: apiHost + '/v2/data/hash_game_token',
								data: {token:new_token},
								crossDomain: true,
								async: true,
								success: function(res) {
									if(res.status === 'success') {
										if(charge_url_redirect.indexOf("?") != -1){
											window.top.location.href=charge_url_redirect+"&token="+new_token+"&valid_to="+res.valid_to+"&sign="+res.token;
										} else{
											window.top.location.href=charge_url_redirect+"?token="+new_token+"&valid_to="+res.valid_to+"&sign="+res.token;
										}
									} else {
										alert('Xảy ra lỗi');
									}
								}
							});
						}
						else {
							window.location.href= "/";
						}
					}, 600);
				}
			});
		}
	});

    $('body').on('click', '.login-facebook', function () {
    	var service = $(this).attr('data-service');
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				if (!response.authResponse) $("#loading").hide();
				else facebook_login(response, service);
			} else {
				FB.login(function(response) {
					if (!response.authResponse) $("#loading").hide();
					else facebook_login(response, service);
				}, {scope: 'email,public_profile'});
			}
		});

	});

	$('body').on('click', '#send-otp-email', function () {
		$.ajax({
			type: 'post',
			url: apiHost + '/v2/gen_odp',
			data: {
				uuid: sessionStorage.getItem('id'),
				type: 'email'
			},
			beforeSend() {
				$('#send-otp-email').html('Đang gửi email..');
			}
		}).done(function (res) {
			setTimeout(function() {
				$('#send-otp-email').html('GỬI EMAIL TỚI ' + sessionStorage.getItem('useremail'));
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
		$.ajax({
			type: 'post',
			url: apiHost + '/v2/gen_odp',
			data: {
				uuid: sessionStorage.getItem('id'),
				type: 'sms'
			},
			beforeSend() {
				$('#send-otp-sms').html('Đang gửi SMS..');
			}
		}).done(function (res) {
			setTimeout(function() {
				$('#send-otp-sms').html('GỬI SMS TỚI ' + sessionStorage.getItem('userphone'));
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

	$('#loginConfirmAuthen').validate({
		rules: {
			otp_code: { required: true }
		},
		messages: {
			otp_code: { required: "Vui lòng nhập mã xác thực" }
		},
		submitHandler: function(form) {
			var code = $('input[name="otp_code"]').val();
			$.ajax({
				type: 'post',
				url: apiHost + '/v2/verify_login_otp',
				data: {
					username: sessionStorage.getItem('username'),
					userpass: sessionStorage.getItem('userpass'),
					uuid: sessionStorage.getItem('id'),
					code: code
				},
				crossDomain: true,
				async: true,
				success: function(res) {
					if(res.status === 'error') {
						Swal.fire({
							icon: 'error',
							title: 'Đã xảy ra lỗi',
							html: res.message,
							confirmButtonText: 'ĐÓNG',
						});
					}
					if(res.status === 'success') {
						const Toast = Swal.mixin({
							toast: true,
							position: 'top',
							showConfirmButton: false,
							timer: 600,
							timerProgressBar: true,
							onOpen: (toast) => {
								toast.addEventListener('mouseenter', Swal.stopTimer)
								toast.addEventListener('mouseleave', Swal.resumeTimer)
							}
						});
	
						Toast.fire({
							icon: 'success',
							title: 'Đăng nhập thành công'
						});
						// var time = Date.now() + res.auth.account.expires_in;
						setCookie('user_id', res.uuid, res.auth.account.expires_in);
						setCookie('username', res.username, res.auth.account.expires_in);
						setCookie('access_token', res.auth.account.access_token, res.auth.account.expires_in);
						setCookie('payment_token', res.auth.payment.access_token, res.auth.payment.expires_in);
						setTimeout(function () {
							if(sessionStorage.getItem('charge_url') !== null) {
								window.location.href  = '/' + sessionStorage.getItem('charge_url');
							} else {
								window.location.href= "/";
							}
						}, 600);
					}
				}
			});
		}
	});

	$('#formFogot').validate({
		errorClass: "invalid",
		validClass: "valid",
		errorPlacement: function(error, element) {
			return false;
		},
		rules: {
			user_email: {
				required: {
					depends:function(){
						$(this).val($.trim($(this).val()));
						return true;
					}
				},
				email_domain: true
			}
		},
		messages: {},
		submitHandler: function(form) {
			$.ajax({
				type: 'post',
				url: apiHost + '/v2/forgot_password',
				data: $(form).serialize(),
				crossDomain: true,
				async: true,
				beforeSend: function() {
					$('.send-request-pwd').attr('disabled', 'disabled');
					$('.send-request-pwd').append(' <i class="fa fa-spin fa-cog"></i>');
				},
				success: function(res) {
					if(res.status === 'success') {
						showNotice(res.message);
					} else {
						showError('Đã xảy ra lỗi', res.message, false);
					}
					
					$('.send-request-pwd').removeAttr('disabled');
					$('.send-request-pwd').html('Gửi yêu cầu');
				}
			});
		}
	});

	$('#gtvID').on('shown.bs.modal', function () {
		//hide menu
		$('.tabbar .tab-menu li.has-child:hover .tab-submenu').css("display", "none");
		$('#login-md').modal('hide');
		$('#register-md').modal('hide');
	});

	$('#login-md').on('shown.bs.modal', function () {
		//hide menu
		$('.tabbar .tab-menu li.has-child:hover .tab-submenu').css("display", "none");
		$('#gtvID').modal('hide');
		$('#register-md').modal('hide');
	});

	$('#register-md').on('shown.bs.modal', function () {
		//hide menu
		$('.tabbar .tab-menu li.has-child:hover .tab-submenu').css("display", "none");
		$('#gtvID').modal('hide');
		$('#login-md').modal('hide');
	});

	$('.tabbar .tab-menu li.has-child').on('touchstart', function() {
		$('.tabbar .tab-menu li.has-child:hover .tab-submenu').css("display", "block");
	});

});
