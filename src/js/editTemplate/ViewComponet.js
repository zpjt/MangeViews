/**
 * 左侧所有的组件
 */
class ViewComponet {
	constructor() {
	  this.handle();
	}

	init() {
		
	}

	handle() {
		//目标组件的拖拽事件
		const $eleDrags = $(".component-item");
		$.map($eleDrags, function(eleDrag) {

			eleDrag.onselectstart = function() {
				return false;
			};
			eleDrag.ondragstart = function(ev) {

				const type = ev.target.getAttribute("echo-type");

				console.log(type,"startDrop");

				ev.dataTransfer.effectAllowed = "move";
				ev.dataTransfer.setData("type", type);
				ev.dataTransfer.setDragImage(ev.target, 0, 0);
				return true;
			};
			eleDrag.ondragend = function(ev) {
				/*拖拽结束*/
				ev.dataTransfer.clearData("type");
				return false
			};
		});
	}
}

export {ViewComponet} ;