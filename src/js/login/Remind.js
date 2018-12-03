class Remind{

  constructor($user,$pwd){

      this.reminCheck = $("#remind");

      this.RemindFill($user,$pwd);
  }

  getRemind(){

    const remindUser = window.localStorage.getItem("$remind_u");
    const remindPwd = window.localStorage.getItem("$remind_p");

    return {remindUser,remindPwd};

  }  

  setRemind(obj){
    const user = obj.user_name;
    const pwd = obj.originPwd;

    window.localStorage.setItem("$remind_u",user);
    window.localStorage.setItem("$remind_p",pwd);
  }  

  removeRemind(){

    window.localStorage.removeItem("$remind_u");
    window.localStorage.removeItem("$remind_p");

  }  

  RemindFill($user,$pwd){
    
    const {remindUser,remindPwd} = this.getRemind();

    const status = remindUser && remindPwd && true || false ;

    this.reminCheck.prop("checked",status);

    if(status){

       $user.val(remindUser);
       $user.parent().addClass("s-filled");
       $pwd.val(remindPwd);
       $pwd.parent().addClass("s-filled");
    }

  }

}

export {Remind};