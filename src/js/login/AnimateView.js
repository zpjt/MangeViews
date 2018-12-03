const  anime = require("js/common/anime.min.js");
const imgUrl = window.jsp_config.resourse && window.jsp_config.resourse || "../";
class AnimateView{

    constructor(){
        this.init();
    }

    init(){
        this.Roate($);
        this.initRoate();
    }

    initRoate(){

       $('#roate1').Roate({
            R:193,
            cx:296,
            cy:274,
            step:0.5,
            delay:60
        });

        $('#roate2').Roate({
            R:205,
            R0:81,
            cx:302,
            cy:519,
            direction:false,
            step:0.5,
            delay:60,
            screenEl:$(".screen-bg")
        });

        this.initType('9902');
    }

    initType(typeCode){
         $('.roate-container').addClass('type'+typeCode);
    }

    Roate($){


        $.fn.Roate=function(opts){

            let roateInter=null;
            const $this =this;
            opts = $.extend({
                R:100,
                R0:0,
                cx:0,
                cy:0,
                step:5,
                delay:100,
                direction:true,//逆时针或逆时针
                roateItem:'.roate-item'
            },opts||{});

            const width = $this.width();
            const height = $this.height();
            if(!opts.cx){
                opts.cx=width/2;
            }
            if(!opts.cy){
                opts.cy=height/2;
            }
            const $item = $this.find(opts.roateItem);
            const size = $item.length;
            let roate=0;
          
            opts.R0 = opts.R0==0?opts.R:opts.R0;
            roateInter=setInterval(function(){

           
            for (let i = 0; i < size; i++) {
                const left = opts.cx+opts.R*Math.sin(Math.PI/180*(roate+360*i/size));
                const top = opts.cy+opts.R0*Math.cos(Math.PI/180*(roate+360*i/size));
                const $roate = $item.eq(i);
                const rheight = $roate.height()/2;
                const rwidth = $roate.width()/2;
                $roate.css({
                    left: left-rheight,
                    top: top-rwidth
                });
            };

            const $screen = opts.screenEl;
            if($screen){ 
                const arr = [];
                for(let i =0; i<4; i++){

                    arr[i] = (roate + 90*i)%360;
                }

                const end = arr.findIndex(function(val){
                    return val === 130 ;
                });

                 const color = ["screen-bg1","screen-bg2","screen-bg3","screen-bg4"];

                 if(end >-1){

                    $screen.css({
                        "background-image":`url(${imgUrl}img/${color[end]}.png)`,
                    }); 

                   anime({
                              targets: '.screen-bg',
                              translateY:374,
                              scale:1.5,
                              duration: 1000,
                              direction:"reverse",
                               easing: [.91,-0.54,.29,1.56],
                               complete: function(anim) {
                                $screen.css({
                                    "transform": "translateY(0)",
                                });
                              }
                    }); 
                  
                 } 
            }

            if(opts.direction){
                roate -= opts.step;
            }else{
                roate += opts.step;
            }

        }, opts.delay);


        //反转方向

       /* this.parent().mousemove(function(event) {
            if(event.offsetX<width/2){
                opts.direction=false;
            }else{
                opts.direction=true;
            }
        });*/

    };

    }
}

export {AnimateView} ;