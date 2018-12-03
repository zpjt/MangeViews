
import {api} from "api/szViews.js";

class DelModal{

	constructor(config){

		const {unit,modal,reloadStyleBox} = config;

		this.unit = unit ;
		this.modal = modal ;
		this.reloadStyleBox = reloadStyleBox;
		this.$confirmBtn =$("#confirmBtn");
		this.$confirmMView=$("#confirm-MView");
		this.handle();
	}

	delHandle(selArr){
			
			if(!selArr.length){
				this.unit.tipToast("选择要删去的！",2);
				return ;
			}
			const id = selArr.join(",");
			this.modal.show(this.$confirmMView);
			this.$confirmBtn.attr("delArr",id);
	}

	del(id){
		const user_id  = window.jsp_config.user_id;
		api.updataRecycle({user_id,id}).then(res=>{


				if(res){
					this.reloadStyleBox();
					this.unit.tipToast("删除成功！",1);
				}else{
					this.unit.tipToast("删除失败！",0);
				}

				this.modal.close(this.$confirmMView);

			});

	}


	handle(){
		
		const _self = this;
		// 删除模态框确认按钮
		this.$confirmBtn.click(function(){
			const id = $(this).attr("delArr");
			_self.del(id);
		});
	
	}
}
export {DelModal}