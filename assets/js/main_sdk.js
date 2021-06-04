
$(function() {
	$.validator.addMethod("integer", function(value, element) {
		return Number.isInteger(value);
	}, "Vui lòng nhập 1 số nguyên");
	$.validator.addMethod("email_domain", function(value, element) {
		return this.optional(element) || /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value) || /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/.test(value);
	}, "Please specify the correct url/email");
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
	$('body').on('click', '.pack-item', function() {
		$('.list-package .item').removeClass('active');

		$(this).parent().addClass('active');
		var mn = $(this).parent().attr('data-money');
		var productid = $(this).parent().attr('data-productid');
		var itemid = $(this).parent().attr('data-itemid');

		if($(this).parent().hasClass('active')) {
			$('input:radio[name=package_money]').filter('[value="'+mn+'"]').prop('checked', true);
			$('input:radio[name=package_pid]').filter('[value="'+productid+'"]').prop('checked', true);
			$('input:radio[name=service_item_id]').filter('[value="'+itemid+'"]').prop('checked', true);
		}
		// kiem tra gia tri co dc danh dau ko
		let checkCoin = $('input:radio[name=package_money]:checked').val();
		let checkPid = $('input:radio[name=package_pid]:checked').val();
	});
	$('body').on('click', '.card-item', function () {
		$('.card-item').removeClass('active');
		$(this).addClass('active');
		var port = $(this).attr('data-port');
		if($(this).hasClass('active')) {
			$('input:radio[name=port_checkout]').filter('[value="'+port+'"]').prop('checked', true);
		}
		var pay_type = $(this).attr('data-pay-type');
		if(pay_type == 1) $('.card-info').removeClass('hidden');
		if(pay_type == 0 || pay_type == null) $('.card-info').addClass('hidden');
	});

    // FORM AJAX
    
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
		return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
function randomStr() {
	var result           = '';
   	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   	var charactersLength = characters.length;
   	for ( var i = 0; i < 6; i++ ) {
      	result += characters.charAt(Math.floor(Math.random() * charactersLength));
   	}
   	return result;
}
function removeSpaces(string){
	return string.split(' ').join('');
}

