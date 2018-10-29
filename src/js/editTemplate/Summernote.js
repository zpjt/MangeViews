
class Summernote{

	static loading = false ;

	constructor(config){

		const { modal,unit} = config;
		this.modal = modal;
		this.unit = unit;

		this.editBox = $("#editBox");
		this.editMd = $("#editViewMd");
		this.handle();
	}

	init(){

		if(!Summernote.loading){

			const editFrame = `<iframe src="assert/summernote-develop/index.html" frameborder="0" style="width: 100%;height: 100%"></iframe>`;

			this.editBox.html(editFrame);
			Summernote.loading = true ;
	
		}else{
			return ;
		}
	}

	upModalStatus(){

		this.init();
		this.modal.show(this.editMd);

	}
	handle(){

	}

}

export {Summernote};