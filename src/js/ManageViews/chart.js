import {
	api
} from "api/ManageViews.js";


/*
	chartType:用来区分图形类别
	3:表格
	4:折线
	5:饼图
	6:雷达图
	7:散点图

*/

class Chart {

	constructor($el, config, data) {

		const {
			border
		} = config;
		this.border = border;
		this.type = "";
		this.Box = $el;
		this.init(data);
		this.color = ["#1296FB", "#8FD6FA", "#0088CC", "#06B76A", "#CBC450", "#FD8D1D"];

	}

	init(res) {
		const typeObject = {
			"3": "tabConfig",
			"4": "lineConfig",
			"5": "pieConfig",
			"6": "radarConfig",
			"7": "scatterConfig",
		}

		const border = this.border;


		const {
			graphInfo: {
				chartType,
				chartName,
				contrastDim,
				rowDim
			},
			data
		} = res;

		this.type = chartType;

		const option = this[typeObject[this.type]](data);
		option.Dim = {
			contrastDim,
			rowDim,
		};

		if (border==="0") { // 没边框
			option.title = {
				text: chartName,
				left: "center",
				textStyle: {
					color: "white",
					fontSize: 14,
				}
			}
		};
		let myChart = echarts.init(this.Box);
		myChart.setOption(option);
		//窗口自适应
		$(window).on("resize", function() {
			myChart.resize();
		});

	}


	pieConfig(res) {

		console.log(res);

		const {rowData,legend ,roseType} = res[0] ;

		const data = rowData.map((val, index) => {

			return {
				"name": res[0].rowDimName[index],
				//"value": val != "--" && val || 0,
				value:this.getRandom(),
				selected: roseType % 2 !== 0 ,
			}
		});


		//color:["#1296FB","#8FD6FA","#0088CC","#06B76A","#CBC450","#FD8D1D"],


		const startColor = ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4'];
		const endColor = ['#1296FB', '#0088CC', '#00c4a5', '#ea2e41','#05ffff', '#ff6584'];

		//  color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4'],

		const borderStartColor = ['#05acff', '#ee36ff', '#05fcfb', '#ffa597'];
		const borderEndColor = ['#09c1ff', '#8171ff', '#05ffff', '#ff6584'];



		const RealData = data.map((val, index) => {

			const itemStyle = {
				normal: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0,
							color: startColor[index] // 0% 处的颜色
						}, {
							offset: 1,
							color: endColor[index] // 100% 处的颜色
						}],
						globalCoord: true // 缺省为 false
					},
				}
			};
			return Object.assign({}, val, {
				itemStyle
			});
		});

		const borderData = data.map((val, index) => {

			const itemStyle = {
				normal: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [{
							offset: 0,
							color: borderStartColor[index] // 0% 处的颜色
						}, {
							offset: 1,
							color: borderEndColor[index] // 100% 处的颜色
						}],
						globalCoord: false // 缺省为 false
					},
				}
			};
			return Object.assign({}, val, itemStyle);
		});

		const config = this.getLegendPosition(legend);

		const legendObj = Object.assign(config.legend, {
			textStyle: {
				color: '#f2f2f2',
				fontSize: 12,
			},
			icon: 'circle', //形状
			data: data,
		});




		const radius = roseType  < 3 &&  ["10%","60%"] || ['30%', '60%'] ;
		const roseTypeStr = roseType % 2 === 0  ? true : false ;
		
		const  rich = {
		    white: {
		        color: '#ddd',
		        align: 'center',
		        padding: [3, 0]
		    }
		};

		

		return {
			tooltip: {
				show: true,
				trigger: 'item',
			},
			roseType:roseTypeStr,
			legend:legendObj,
			series: [
				// 主要展示层的
				{
					radius:radius,
					center: config.center,
					type: 'pie',
					label: {
		                show: true,
		                position: 'outside',
		                color: '#ddd',
		                formatter: function(params) {
		                    var percent = 0;
		                    var total = 0;
		                    for (var i = 0; i < data.length; i++) {
		                        total += data[i].value;
		                    }
		                    percent = ((params.value / total) * 100).toFixed(0);
		                    if(params.name !== '') {
		                        return params.name + '\n{white|' + '占比' + percent + '%}';
		                    }else {
		                        return '';
		                    }
		                },
		                rich: rich
		            },
		            labelLine: {
		             //   length:30,
		            //    length2:100,
		                show: true,
		                color:'#ffff'
		            },
					name: "",
					data: RealData,
					tooltip: {
						formatter: "{b}: {c}"
					}
				},
				// 边框的设置
				/*{
					radius: ['31%', '36%'],
					center: ['50%', '50%'],
					type: 'pie',
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					animation: false,
					tooltip: {
						show: false
					},
					data: borderData
				},*/
				// 中心的圆圈
				/*{
					radius: ['26%', '31%'],
					center: ['50%', '50%'],
					type: 'pie',
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					tooltip: {
						show: false
					},
					data: [{
						value: 100,
						name:'',
						itemStyle: {
							normal: {
								color: '#0FC8FE',
							}
						}
					}],
					animation: false
				}*/
			]
		};
	}

	getRandom(max = 1000) {

		return Math.floor(Math.random() * (max - 80 + 1) + 80);

	}

	getLegendPosition(legend,is_landscape = false) {

		const border = this.border;

		const top = border === "3" ? "12%" : "8%";
		const left_add = is_landscape && 2  || 0;
		const top_add = border === "3" ? 4 :  3;
		const grid_top_add = border === "3" ? 8  : 6;

		switch (legend) {
			case "1":
				{

					const legend = {
						top: top,
						left: "4%",
						orient: 'horizontal',
					};

					const grid = {
						top: grid_top_add + 20 + "%",
						left: left_add + 14 +"%",
						right: "6%",
						bottom: "12%",
					};

					const center = [ "50%" , top_add + 55 + "%"];

					return {
						legend,
						grid,
						center,
					};
				}
				break;
			case "2":
				{

					const legend = {
						bottom: 16,
						left: "4%",
						orient: 'horizontal',
					};

					const grid = {
						top: grid_top_add + 12 + "%",
						left: left_add + 14 +"%",
						right: "6%",
						bottom: "32%",
					};

					const center = ["50%" , top_add + 45 +"%"];

					return {
						legend,
						grid,
						center,
					};
				}
				break;
			case "3":
				{
					const legend = {
						top: top,
						left: 4,
						orient: 'vertical',
					};

					const grid = {
						left: left_add + 30 +"%",
						top: grid_top_add + 12 + "%",
						right: "6%",
						bottom: "14%",
					};

					const center = ["55%" , top_add + 50 +"%"];

					return {
						legend,
						grid,
						center
					}

				}
				break;
			case "4":
				{
					const legend = {
						top: top,
						right: 4,
						orient: 'vertical',
					};

					const grid = {
						top: grid_top_add + 14 + "%",
						right: "24%",
						left: left_add + 12 +"%",
						bottom: "14%",
					};

					const center = ["45%" , top_add + 50 +"%"];

					return {
						legend,
						grid,
						center,
					}
				}
				break;
			case "5":
				{
					const legend = {
						show: false,
					};

					const grid = {
						left: left_add + 14 +"%",
						right: "6%",
						top: grid_top_add + 12 + "%",
						bottom: "14%",
					};

					const center = ["45%" , top_add + 50 +"%"];

					return {
						legend,
						grid,
						center,
					}

				}
				break;
			default:
				break;
		}


	}

	lineConfig(res) {

		/**
		 * @legendArr  {图例数组} 
		 * @xAxisData  {X轴的数据} 
		 * @series  {系列对象，} 
		 * @contrastDimName  {对比的维度} 
		 * @lineType  {折线类型 1:折线,3：柱状} 
		 * @legendArr  {图例数组} 
		 * @legendArr  {图例数组} 
		 * @return {[type]}     [description]
		 */

		console.log(res);

		const {rowDimName, landscape, legend, threeD, stack ,lineType} = res[0];

		const Axis = threeD.split(",");

		const xAxisData = rowDimName.map(val => {
			return {
				value: val,
				textStyle: {
					color: "white"
				}
			}
		});

		let legendArr = [];

		const color = ['#1a9bfc', '#99da69', '#e32f46', '#7049f0', '#fa704d', '#01babc'];
		
		const series = res.map((val, index) => {

			const {contrastDimName, rowData } = val;

			legendArr[index] = contrastDimName;
		
			const areaStyle = lineType === "1" && landscape === "1" && {
				normal: {
	                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                    offset: 0,
	                    color: color[index]
	                }, {
	                    offset: 0.8,
	                    color: 'rgba(255,255,255,0)'
	                }], false),
	                // shadowColor: 'rgba(255,255,255, 0.1)',
	                shadowBlur: 10,
	                opacity:0.3,
	            }
			} || null;

			/*const data = rowData.map(val=>{
				return val != "--" && val || null ;
			});*/
			const data = rowData.map(val => this.getRandom());

			return {
				name: contrastDimName,
				type: lineType === "1" && "line" || "bar",
				areaStyle,
				smooth: true,
				showSymbol: true,
				symbol: 'circle',
				symbolSize: 8,
				barWidth: 20, //柱图宽度
				stack: stack === "1" ? "stack" : null,
				data,
			}
		});

		const is_landscape = lineType === "2" && landscape === "1" ;

		const config = this.getLegendPosition(legend,is_landscape);

		const legendObj = Object.assign(config.legend, {
			textStyle: { //图例文字的样式
				fontSize: 12,
				color: "white"
			},
			data: legendArr,
		});

		const gridObj = Object.assign(config.grid, {});

		const flagCategory = {
				type: 'category',
				data: xAxisData,
			    boundaryGap: lineType !== "1",
				axisLine: { // 轴线
					show: Boolean(+Axis[0]),
					lineStyle: {
						color: "#fff"
					}
				},
				axisTick: { //坐标轴刻度
					show: Boolean(+Axis[0]),
				},
				axisLabel: {
					//	margin: 10,
					textStyle: {
						fontSize: 12
					}
				}
			};

		const flagValue =  {
			type: 'value',
			axisLine: { // 轴线
				show: Boolean(+Axis[1]),
				lineStyle: {
					color: "#fff"
				}
			},
			axisTick: { //坐标轴刻度
				show: Boolean(+Axis[1]),
			},
			splitLine: { //网格线
				show: Boolean(+Axis[1]),
			},
			axisLabel: {
				show: Boolean(+Axis[1]),
				textStyle: {
					fontSize: 12
				}
			}
		};


		const xAxisObj = is_landscape && flagValue || flagCategory ;

		const yAxisObj = is_landscape && flagCategory || flagValue ;

		return {
			color:['#1a9bfc', '#99da69', '#e32f46', '#7049f0', '#fa704d', '#01babc'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					lineStyle: {
						color: '#ddd'
					}
				},
				backgroundColor: 'rgba(255,255,255,1)',
				padding: [5, 10],
				textStyle: {
					color: '#7588E4',
				},
				extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
			},
			grid: gridObj,
			legend: legendObj,
			xAxis: xAxisObj,
			yAxis: yAxisObj,
			series: series,
		};
	}

	scatterConfig(res) {

		console.log(res);
		const {rowDimName, landscape,legend, threeD} = res[0];
		let legendArr = [] ;

		const series = res.map((val, index) => {

			const {contrastDimName, rowData } = val;

			legendArr[index] = contrastDimName;
		
			
				/*const data = rowData.map(val=>{
					return val != "--" && val || null ;
				});*/
				const data = rowData.map(val => this.getRandom());

				return {
					name: contrastDimName,
					type: "scatter",
					smooth: true,
					showSymbol: true,
					symbol: 'circle',
					symbolSize:function(value){

						const val = landscape === "1" && Math.sqrt(value)  || 8;
						
						 return val;
					},
					data,
				}
		});
		

		const Axis = threeD.split(",");

		const xAxisData = rowDimName.map(val => {
			return {
				value: val,
				textStyle: {
					color: "white"
				}
			}
		});


		const config = this.getLegendPosition(legend);

		const legendObj = Object.assign(config.legend, {
			textStyle: { //图例文字的样式
				fontSize: 12,
				color: "white"
			},
			data: legendArr,
		});

		const gridObj = Object.assign(config.grid, {});

		return {
			color: ["#1296FB", "#8FD6FA", "#0088CC", "#06B76A", "#CBC450", "#FD8D1D"],
			legend:legendObj ,
			grid:gridObj,
			tooltip: {
				padding: 10,
				backgroundColor: '#222',
				borderColor: '#777',
				borderWidth: 1,
				formatter: function(obj) {

					const value = obj.value;
					return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 7px;">' +
						obj.seriesName + ': ' + value + '</div>';
						
				}
			},
			xAxis: {
				type: 'category',
				data: xAxisData,
				axisLine: { // 轴线
					show: Boolean(+Axis[0]),
					lineStyle: {
						color: "#fff"
					}
				},
				axisTick: { //坐标轴刻度
					show: Boolean(+Axis[0]),
				},
				axisLabel: {
					//	margin: 10,
					textStyle: {
						fontSize: 12
					}
				}
			},
			yAxis: {
				type: 'value',
				axisLine: { // 轴线
					show: Boolean(+Axis[1]),
					lineStyle: {
						color: "#fff",

					}
				},
				axisTick: { //坐标轴刻度
					show: Boolean(+Axis[1]),
				},
				splitLine: { //网格线
					show: Boolean(+Axis[1]),
					lineStyle: {
		                type: 'dashed',
						opacity:.6,
		            }
				},
				axisLabel: {
					show: Boolean(+Axis[1]),
					textStyle: {
						fontSize: 12
					}
				}
			} ,
			series: series
		};
	}

	radarConfig(res) {

		const {rowDimName,legend ,area} = res[0] ;

		const color = "#189cbb";
		const scale = 1;

		const radar = rowDimName.map(val => {
			return {
				text: val,
				max: function(row) {
					return row.max * 1.5;
				},
			}
		});
		const legendArr = [];
		const data = res.map((val, index) => {

			const {
				rowData,
				contrastDimName
			} = val;
			legendArr[index] = contrastDimName;

			return {
				value: rowData.map(item=>this.getRandom()),
				name: contrastDimName
			}
		});


			const config = this.getLegendPosition(legend);

			const legendObj = Object.assign(config.legend, {
				textStyle: {
					color: '#f2f2f2',
					fontSize: 12,
				},
				itemWidth: 12,
				itemHeight: 12,
				data: legendArr,
			});


		return {
			color: ["#1296FB", "#8FD6FA", "#0088CC", "#06B76A", "#CBC450", "#FD8D1D"],
			tooltip: {
				trigger: 'axis'
			},
			legend:legendObj,
			radar: [{
				indicator: radar,
				center: config.center,
				radius: '55%',
				shape: area === "1" && "polygon" ||"circle",
				name: {
					textStyle: {
						color: "white",
						fontSize: 12,
					}
				},
				nameGap:10,//指示器名称和指示器轴的距离。
				splitLine: {
					lineStyle: {
						color: '#0b5263',
						opacity: 0.5,
						width: 2
					},
				},
				splitArea: {
					areaStyle: {
						color: '#E9E6C9',
						opacity: 1,
						shadowBlur: 45,
						shadowColor: 'rgba(0,0,0,.5)',
						shadowOffsetX: 0,
						shadowOffsetY: 15,
						opacity:0.5
					}
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: color,
						type: "dashed",
					}
				}
			}, ],
			series: [{
				type: 'radar',
				tooltip: {
					trigger: 'item'
				},
				data: data,
				symbolSize: 2,
				itemStyle: {
					normal: {
						borderColor: '#ffc72b',
						borderWidth: 2,
					}
				},
				lineStyle: {
					normal: {
						color: "#fff",
						width: 2
					}
				},
				areaStyle: {
					normal: {
						shadowBlur: 13,
						shadowColor: 'rgba(127,95,132,.3)',
						shadowOffsetX: 0,
						shadowOffsetY: 10,
						opacity: .6
					}
				},
			}, ]
		};

	}

}
export {
	Chart
};