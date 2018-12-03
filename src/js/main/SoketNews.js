

class SoketNews{

	static heartflag = false ;
	static tryTime = 0 ;
	
	constructor(config){

        const {baseUrl,user_id} = window.jsp_config;

		const url = "ws://" + window.location.host+baseUrl;
		this.messageEl = $("#news");
		this.messageTip = $("#messageTip");

		this.config = {
						url:url+"connect",
						userId:user_id,
					};



		if (!window.WebSocket) {
           alert("您的浏览器不支持ws<br/>");
            return;
        }
		

		this.initSocket();
		this.handle();


	}

	initSocket(){

		const {url,userId} = this.config ;
		
		this.webSocket = new WebSocket(url+"/"+userId);

	}

	heart() {

        if (SoketNews.heartflag){
           this.webSocket.send("&");
           console.log("  心跳 <br/>");
        }

        setTimeout("this.heart()", 10*60*1000);

    }

  	send(message){
        this.webSocket.send(message);
    }


	handle(){

		const webSocket = this.webSocket ;
		const _self = this ;
		// 收到服务端消息
        webSocket.onmessage = function (msg) {

        	 const result = msg.data;

            if(result == "&"){

            }else if(result){

            	const data = JSON.parse(msg.data);

            	const str = data.map(val=>{
            		return `<li class="newItem" echo-data="${val.id}">
            					<p class="warn-item">
            						<span class="zb-warn">${val.name}</span>
            						<b class="warn-time">${val.time}</b>
            					</p>
            					<p class="warn-item">${val.text}</p>

            				</li>`
            	});
                
				_self.messageEl.children(".messages-ul").html(str);
				const count = data.length ;
				if(count){
					_self.messageTip.show();
				}else{
					_self.messageTip.hide();
				}
            }
        };

        // 异常
        webSocket.onerror = function (event) {
            SoketNews.heartflag = false;
           console.log(" 异常 ");
        };

        // 建立连接
        webSocket.onopen = function (event) {
            SoketNews.heartflag = true;
            _self.heart();
           console.log("建立连接成功");
            SoketNews.tryTime = 0;
        };

        // 断线重连
        webSocket.onclose = function () {
            SoketNews.heartflag = false;
            // 重试10次，每次之间间隔10秒
            if (SoketNews.tryTime < 10) {
                setTimeout(function () {
                    _self.webSocket = null;
                    SoketNews.tryTime++;
                    _self.initSocket();
                    console.log("  第"+SoketNews.tryTime+"次重连");
                }, 3*1000);
            } else {
                //alert("重连失败.");
            }
        };

	}
}

export {SoketNews};