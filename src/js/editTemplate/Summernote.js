const EDIT_URL = window.jsp_config.edit_url;
class Summernote{

	static loading = false ;
	static status = null ;

	constructor(config){

		const { modal,unit,templateMap } = config;
		this.modal = modal;
		this.unit = unit;

		this.templateMap = templateMap;
		this.editBox = $("#editBox");
		this.editMd = $("#editViewMd");
		this.editFrame = null ;
		this.handle();
	}

	init(){

		if(!Summernote.loading){

			const editFrame = `<iframe src="${EDIT_URL}assert/summernote-develop/index.html"  frameborder="0" style="width: 100%;height: 100%" id="editIframe"></iframe>`;

			this.editBox.html(editFrame);
			this.editFrame = this.editBox.find("#editIframe");
			Summernote.loading = true ;
	
		}else{
			return ;
		}
	}
	setModalSel(){

	}


	upModalStatus($view){
		this.activeBox = $view;
		Summernote.status = "create";
		this.init();
		this.modal.show(this.editMd);
	}

	preEdit(){
		if(this.editFrame){

			const htmlStr = this.editFrame[0].contentWindow.$summernote.summernote("code");

			const status = Summernote.status;
			const $dom = this.activeBox ;
			const attr = {
					borderType:"0",
					type:"editView",
					viewTitle:"",
			};
			this.templateMap.add(htmlStr,$dom,attr,status);


		}

	}
	handle(){

		const _self = this;
		$("#editPre").click(function(){

				_self.preEdit();	

		});
	}

}

export {Summernote};