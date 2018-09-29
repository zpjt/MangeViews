/**
 * 头部组件
 */
class HeadOpt {
	constructor(config) {

		this.config = config;
		this.globalBox = $("#globalBox");
		this.init();
		this.handle();
	}

	init() {
		
	}
	handle() {
		const _self = this ;
		const { modal } = this.config ;
	
		$("#headOpt").on("click", ".head-btn", function() {
			const type = $(this).attr("sign");
			switch (type) {
				case "filter":
					break;
				case "style":
					modal.show(_self.globalBox, "active");


					break;
				case "pre":
					break;
				case "save-as":
					break;
				case "export":
					break;
				case "back":
					const $slide = $("#slide", window.parent.document);
					const $head = $("#content", window.parent.document);
					const width = $slide.hasClass("collapsed") && 45 || 250;
					$slide.animate({
						"width": width
					}, 500, function() {
						window.history.back();
						$head.removeClass("no-head");
					});
					break;

			}
		});

		//全局样式设置
		$("#globalOpt").on("click", ".s-btn", function() {
			const index = $(this).index();

			switch (index) {
				case 0:
					break;

				case 1:
					modal.close(_self.globalBox, "active");
					break;
			}
		});
	}

}


export {HeadOpt} ;
