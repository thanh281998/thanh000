var $owl = $('.owl-home').owlCarousel({
    loop: true,
    margin: 0,
    responsiveClass: true,
    dots: true,
    autoplayTimeout:3000,
    autoplayHoverPause: true,
    nav: false,
    autoHeight:true,
    autoplay: 3000,
    smartSpeed: 1200,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        480: {
            items: 1,
            nav: false,
            loop: true
        },
        600: {
            items: 1,
            nav: false,
            loop: true
        },
        1000: {
            items: 1,
            nav: false,
            loop: true
        }
    }
});
$(function() {
	// Call service api
	processServices();

	$.validator.addMethod("integer", function(value, element) {
		return Number.isInteger(value);
	}, "Vui lòng nhập 1 số nguyên");
	$.validator.addMethod("email_domain", function(value, element) {
		return this.optional(element) || /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value) || /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/.test(value);
	}, "Please specify the correct url/email");

    loginCaptcha();
    registerCaptcha();
	$('.owl-home').owlCarousel({
		loop: true,
		margin: 0,
		responsiveClass: true,
		dots: true,
		autoplayTimeout:3000,
		autoplayHoverPause: true,
		nav: false,
		autoHeight:true,
		autoplay: 3000,
		smartSpeed: 1200,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1,
				nav: false,
			},
			480: {
				items: 1,
				nav: false,
				loop: true
			},
			600: {
				items: 1,
				nav: false,
				loop: true
			},
			1000: {
				items: 1,
				nav: false,
				loop: true
			}
		}
	});
    $('.owl-services').owlCarousel({
		loop: true,
		margin: 0,
		responsiveClass: true,
		dots: true,
		autoplayTimeout:3200,
		autoplayHoverPause: true,
		nav: false,
		autoHeight:true,
		autoplay: 3200,
		smartSpeed: 1100,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 2,
				nav: false,
			},
			480: {
				items: 2,
				nav: false,
				loop: true
			},
			600: {
				items: 3,
				nav: false,
				loop: true
			},
			1000: {
				items: 4,
				nav: false,
				loop: true
			}
		}
	});
	// active menu
	let mn_active = localStorage.getItem('menu_active');
	if(mn_active === 'buy_vip' || mn_active === 'give_vip') {
		$('.sb-plus-collape').addClass('in');
		$('.sb-plus-collape').attr('aria-expanded', 'true');
		$('.sb-plus-collape').css('height', 'auto !important');
	}

	if(mn_active === 'buy_vip') {
		$('.buy-vip').addClass('active');
	} else {
		$('.buy-vip').removeClass('active');
	}
	if(mn_active === 'give_vip') {
		$('.give-vip').addClass('active');
	} else {
		$('.give-vip').removeClass('active');
	}
	$('#sidebar-collapse').on('hidden.bs.collapse', function(e) {
		$('.main').addClass('main-regular');
		$('.main').css('width', '920px');
		$('.home-slide').css('padding-left', '0');
		$owl.trigger('refresh.owl.carousel');
	});
	$('#sidebar-collapse').on('shown.bs.collapse', function(e) {
		$('.main').removeClass('main-regular');
		$('.main').css('width', '100%');
		$('.home-slide').css('padding-left', '260px');
		$owl.trigger('refresh.owl.carousel');
	});

	$('body').on('click', '.item-service', function() {
		var type = $(this).attr('data-type');
		if(type === 'gpoint') {
			sessionStorage.setItem('charge_url', 'deposit');
		}
		if(type === 'plus') {
			sessionStorage.setItem('charge_url', 'plus');
		}
	});

    $('#login-with-id').click(function() {
        $('#gtvID').modal('hide');
        $('#login-md').modal('show');
    });
    $('#register-now').click(function() {
        $('#gtvID').modal('hide');
        $('#register-md').modal('show');
    }); 
    $('#register-from-login').click(function() {
        $('#login-md').modal('hide');
        $('#register-md').modal('show');
    }); 
    $('#click-playnow').click(function() {
        $('#gtvID').modal('hide');
        $('#playgame-md').modal('show');
	});
	$('.aforgot-password').click(function() {
		$('#login-md').modal('hide');
		$('#gtvID').modal('hide');
        $('#forgot-md').modal('show');
	});

	$('body').on('click', '#menu-gtvplus', function(e) {
		$('#menu-plus').collapse('toggle');
		$('#menu-topup-cls').collapse('hide');
		$('#menu-cls').collapse('hide');
	});
	$('body').on('click', '#menu-charge-topup', function() {
		$('#menu-plus').collapse('hide');
		$('#menu-topup-cls').collapse('toggle');
		$('#menu-cls').collapse('hide');
	});
	$('body').on('click', '#charge-game-menu', function() {
		$('#menu-plus').collapse('hide');
		$('#menu-topup-cls').collapse('hide');
		$('#menu-cls').collapse('toggle');
	});

    $('body').on('click', '.login-captcha', function() {
        loginCaptcha();
    });
    // $('body').on('click', '.register-captcha', function() {
    //     registerCaptcha();
    // });
    $('body').on('click', '.reload-login-captcha', function() {
    	loginCaptcha();
    });
    $('body').on('click', '.reload-reg-captcha', function() {
    	registerCaptcha();
    });
	// ck truc tiep
	$('body').on('click', '.trans-pack-item', function() {
		$('.list-package li').removeClass('active');

		$(this).parent().addClass('active');
		var mn = $(this).parent().attr('data-money');

		if($(this).parent().hasClass('active')) {
			$('input:radio[name=transfer_money]').filter('[value="'+mn+'"]').prop('checked', true);
		}
		// kiem tra gia tri co dc danh dau ko
		let checkCoin = $('input:radio[name=transfer_money]:checked').val();
	});

	$("#logoutID").click(function () {
		localStorage.removeItem("url_charge");
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "payment_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		window.location.href = homeUrl;
	});
	$("#m-logout").click(function () {
		localStorage.removeItem("url_charge");
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "payment_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		window.location.href = homeUrl;
	});

	// Test read GTV_ID cookie
    var test = getCookie('gtv_id');
	// console.log(test);
	if(test) {
		var test_decode = JSON.parse(decodeURIComponent(test));
	}

	$('body').on('click', '.show-m-submenu', function() {
		// $(this).hide();
		$('.modal').modal('hide');
		$('.mobile-menu').css('display', 'flex');
		$('.close-menu').show();
	});
	$('body').on('click', '.close-menu', function() {
		$(this).hide();
		$('.mobile-menu').css('display', 'none');
		$('.bars-menu').show();
	});

	$(document).on('show.bs.modal', function(){
		$('.mobile-menu').css('display', 'none');
		$('.close-menu').hide();

		var elements = document.getElementsByTagName("input");
		for (var ii=0; ii < elements.length; ii++) {
			if (elements[ii].type !== "button" && elements[ii].type !== "hidden") {
				elements[ii].value = "";
			}
		}
		var login_valid = $("#loginForm").validate();
		var reg_valid = $('#registerForm').validate();
		var otp_form = $('#loginConfirmAuthen').validate();
		login_valid.resetForm();
		reg_valid.resetForm();
		otp_form.resetForm();

		loginCaptcha();
		registerCaptcha();
	});
});

function showToast(msg) {

	Swal.fire({
		icon: 'success',
		title: 'Thành công',
		text: msg,
		// footer: 'Đã xử lý thành công',
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: true,
		confirmButtonText: 'ĐÓNG',
		onClose: function () {
			window.location.reload(true);
		}
	});
}
function showNotice(msg) {

	Swal.fire({
		icon: 'success',
		title: 'Thành công',
		text: msg,
		// footer: 'Đã xử lý thành công',
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: true,
		confirmButtonText: 'ĐÓNG'
	});
}
function showError(title, msg, html) {
	if(html == false)
		Swal.fire({
			icon: 'info',
			// title: title,
			text: msg,
			confirmButtonText: 'ĐÓNG',
		});
	else
		Swal.fire({
			icon: 'info',
			// title: title,
			html: msg,
			confirmButtonText: 'ĐÓNG',
		});
}

$( document ).ajaxError(function( event, jqxhr, settings, exception ) {
    if ( jqxhr.status == 401 ) {
        localStorage.removeItem("url_charge");
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "payment_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		window.location.href = homeUrl;
		return false;
    }
});

function setCookie(cname, cvalue, time) {
	var d = new Date();
	// d.setTime(d.getTime() + (exdays*24*60*60*1000));
	d.setTime(d.getTime() + (time*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function setCookie2(cname, cvalue, time) {
    // var d = new Date();
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var d = new Date(time);
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;secure";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function moneyFormat(num) {
	if(num == null) return 0;
	else {
		num = num + '';
		return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
function getSegParam() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('/') + 1).split('/');
	for(var i = 0; i < hashes.length; i++)
	{
		// hash = hashes[i].split('=');
		vars.push(hashes[i]);
		vars[hashes[0]] = hashes[1];
	}
	return vars;
}

function registerCaptcha() {
    var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
		'0','1','2','3','4','5','6','7','8','9');
	var i;
	for (i=0;i<6;i++) {
		var a = alpha[Math.floor(Math.random() * alpha.length)];
		var b = alpha[Math.floor(Math.random() * alpha.length)];
		var c = alpha[Math.floor(Math.random() * alpha.length)];
		var d = alpha[Math.floor(Math.random() * alpha.length)];
		var e = alpha[Math.floor(Math.random() * alpha.length)];
		var f = alpha[Math.floor(Math.random() * alpha.length)];
		// var g = alpha[Math.floor(Math.random() * alpha.length)];
	}
	var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f;
	if(document.getElementById("regCaptcha")) {
		document.getElementById("regCaptcha").innerHTML = code;
        document.getElementById("regCaptcha").value = code;
        document.getElementById("input-rcaptcha").value = removeSpaces(code);
	}
}

function loginCaptcha() {
    var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
		'0','1','2','3','4','5','6','7','8','9');
	var i;
	for (i=0;i<6;i++) {
		var a = alpha[Math.floor(Math.random() * alpha.length)];
		var b = alpha[Math.floor(Math.random() * alpha.length)];
		var c = alpha[Math.floor(Math.random() * alpha.length)];
		var d = alpha[Math.floor(Math.random() * alpha.length)];
		var e = alpha[Math.floor(Math.random() * alpha.length)];
		var f = alpha[Math.floor(Math.random() * alpha.length)];
		// var g = alpha[Math.floor(Math.random() * alpha.length)];
	}
	var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f;
	if(document.getElementById("loginCaptcha")) {
		document.getElementById("loginCaptcha").innerHTML = code;
        document.getElementById("loginCaptcha").value = code;
        if(document.getElementById("input-lcaptcha")) document.getElementById("input-lcaptcha").value = removeSpaces(code);
	}
}
function validateCaptcha(captcha, text) {
	if(captcha.toLowerCase() == text.toLowerCase()) return true;
	else return false;
}
function randomStr(length) {
	var result           = '';
   	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   	var charactersLength = characters.length;
   	for ( var i = 0; i < length; i++ ) {
      	result += characters.charAt(Math.floor(Math.random() * charactersLength));
   	}
   	return result;
}
function removeSpaces(string){
	return string.split(' ').join('');
}

function processServices() {
	$.ajax({
		type: 'POST',
		url: apiHost + '/v2/data/services_by_type',
		dataType: 'json',
		success: function (res) {
			if(res.status == 'success'){

				// Select for list service
				// Update service_list
				service_list = res.data;

				var gameItem = '', mItem = '';
				var gameDetailItem = '', mDetailItem = '';
				$.each(res.data, function (index,Object) {
					var url = (user ? '/pay-'+ Object.short_name : '/topup/'+ Object.short_name);
					if(Object.status != 1) url = '#';
					var urlDetail = '/game-'+ Object.short_name;
					if(Object.service_icon === "" || Object.service_icon === null || Object.service_icon === undefined) {
						if(parseInt(Object.status) === 1) {
							mItem += '<div class="col-xs-6 col-sm-4 col-md-3"><div class="item-service"><a href="'+url+'">' +
								'<img src="/asset/images/games/icon-default.png" alt=""></a>' +
								'<a href="'+url+'">'+Object.service_name+'</a>' +
								'</div></div>';
						}
						mDetailItem += '<div class="col-xs-6 col-sm-4 col-md-3"><div class="item-service"><a href="'+urlDetail+'">' +
							'<img src="/asset/images/games/icon-default.png" alt=""></a>' +
							'<a href="'+urlDetail+'">'+Object.service_name+'</a>' +
							'</div></div>';
					} else {
						if(parseInt(Object.status) === 1) {
							mItem += '<div class="col-xs-6 col-sm-4 col-md-3"><div class="item-service"><a href="'+url+'">' +
								'<img src="'+ Object.service_icon.replace('http://', 'https://') +'" alt=""></a>' +
								'<a href="'+url+'">'+Object.service_name+'</a>' +
								'</div></div>';
						}
						mDetailItem += '<div class="col-xs-6 col-sm-4 col-md-3"><div class="item-service"><a href="'+urlDetail+'">' +
							'<img src="'+ Object.service_icon.replace('http://', 'https://') +'" alt=""></a>' +
							'<a href="'+urlDetail+'">'+Object.service_name+'</a>' +
							'</div></div>';
					}

				});
				// $('.list-service').append(gameItem);
				$('#mListServices').append(mItem);
				$('#mListDetailServices').append(mDetailItem);

				// Ban, unband
				var banOptions = '';
				$.each(res.data, function () {
					banOptions += '<option  value="' + this.service_id + '">'+ this.service_name +'</option>';
				});
				$('#servicesBanList').html(banOptions);
				$('#servicesunBanList').html(banOptions);

				// Side bar
				var topup = '<a href="/deposit" title="Nạp tiền">Nạp Gạo</a>';
				var gameItem = '<a href="/deposit" title="Nạp tiền">Nạp Gạo</a>';
				gameItem += '<a href="/plus" title="Nạp GPoint">GTV Plus</a>';
				if (user == "") {//chua dang nhap
					topup += '<a href="/plus" title="Nạp GPoint">GTV Plus</a>';
				} else { // da dang nhap
					topup += '<a href="/plus" title="Nạp GPoint">GTV Plus</a>';
				}


				$.each(res.data, function (index,Object) {
					var url = (user ? '/pay-'+ Object.short_name : '/topup/'+ Object.short_name);
					gameItem += '<a href="'+url+'" title="'+Object.service_name+'">'+Object.service_name+'</a>';
					topup += '<a href="/topup/'+Object.short_name+'" title="'+Object.service_name+'">'+Object.service_name+'</a>';
				});

				$('.sb-menu-collape').html(gameItem);
				$('.sb-topup-collape').html(topup);

			} else {
				alert('lỗi kết nối api');
			}
		}
	});
}
