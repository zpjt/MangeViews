import "css/login.scss";

const {baseUrl} = window.jsp_config;
const [$user,$pwd,$userWarn,$pwdWarn,$warn,$stateWarn,$submitLoad,$inp] = [$("#user"),$("#pwd"),$("#user_warn"),$("#pwd_warn"),$(".warn"),$("#state_warn"),$("#submitLoad"),$(".inp")];

$("#btnLogin").click(function(){
	
	const user_name = $user.val().trim();
	let password = $pwd.val().trim();
	$warn.html("");
	$inp.css("borderColor","#ddd");
    if(!user_name){
		$userWarn.html('<span><i class="fa fa-exclamation-triangle">&nbsp;&nbsp;</i>用户名不能为空</span>');
		$user.css("borderColor","red");
		return ;
    }

     if(!password){
		$pwdWarn.html('<span><i class="fa fa-exclamation-triangle">&nbsp;&nbsp;</i>密码不能为空</span>');
		$pwd.css("borderColor","red");
		return ;
    }
	
	password=hex_md5(hex_md5(password));
	$submitLoad.addClass("fa-spinner fa-pulse");
	Promise.resolve(
		$.ajax({
			url:baseUrl+"/login/logVal",
			contentType:"application/json",
			type:"post",
			asyncBoolean:false,
			data:JSON.stringify({user_name,password}),
		})
	)
	.then(data=>{
  
		$submitLoad.removeClass("fa-spinner fa-pulse");
		if(data.url=="null") {
			$stateWarn.html('<span><i class="fa fa-exclamation-triangle"></i>用户名或密码错误！</span></p>');
		}else if(data.url == "0"){
			$stateWarn.html('<span><i class="fa fa-exclamation-triangle"></i>该账户已被禁用</span></p>');
		}else {
		//	window.location.href=baseUrl+data.url;	
			window.location.href=data.url;	
		}
	})
	


})