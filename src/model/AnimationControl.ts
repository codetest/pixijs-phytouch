import * as PIXI from "pixi.js"
import Vue from "vue"
import { isNullOrUndefined } from "util";
import PhyTouch from "./PhyTouchExtend"

export class AnimationControl{
    private instance:Vue;
    private app: PIXI.Application;
    private loader: PIXI.Loader;
    private minWidth: number = 0
    private touch: any = undefined
    private stage: number = 0;
    private offset: number = 0;
    constructor(instance: Vue){
        this.instance = instance;
        this.app = new PIXI.Application({ 
			width: window.innerWidth, 
			height: window.innerWidth,       
			transparent: false, 
			resolution: 1
        });
        this.instance.$el.appendChild(this.app.view)
        this.loader = new PIXI.Loader();
        this.loader.add("1.jpg").add("2.jpg")
		.load(() => {this.setup()});
    }

    bindTouch(){
        this.touch = new PhyTouch({
            touch:"#canvas",
            vertical: false,
            property: "translateX",
            value: this.app.stage.x,
            step: 1,
            max: 0,
            min: this.minWidth,
            fixed: false,
            change: (value: number)=>{
                this.onChange(value)
            },
            touchStart: () => {
                console.log("touchStart")
            },
            touchEnd: () => {
                console.log("touchEnd")
            },
            animationEnd: (value: number) => {
                if (isNaN(value) || isNullOrUndefined(value)){
                    return;
                }

                this.offset = value;
                this.app.stage.x = value
            }
        })
    }

    unbindTouch() {
        if (!this.touch){
            return;
        }

        console.log("start unbound")
        this.touch.destroy()
        this.touch = undefined
        setTimeout(() => {
            console.log("start bound")
            this.stage = 1;
            this.minWidth = -this.app.stage.width + window.innerWidth
            this.bindTouch()
            this.touch.to(this.minWidth, 10000)
        }, 2000)
    }

    onChange(value: number){
        if (!this.touch){
            return;
        }

        if (isNaN(value) || isNullOrUndefined(value)){
            return;
        }

        if (value > 0){
            return;
        }
        else if (value < this.minWidth){
            return;
        }

        this.offset = value
        this.app.stage.x = value
        if (this.stage === 0){
            if (value < this.minWidth / 2){
                this.unbindTouch()
            }
        }
    }

    setup(){
        var resource = this.loader.resources["1.jpg"]
        var newWidth = resource.texture.width * (this.app.view.height / resource.texture.height);
        var img = new PIXI.Sprite(resource.texture);
        img.height = this.app.view.height;
        img.width = newWidth
        this.minWidth = -newWidth + window.innerWidth;

        this.app.stage.addChild(img)   
        resource = this.loader.resources["2.jpg"]
        var img1 = new PIXI.Sprite(resource.texture) 
        img1.x = img.width;
        img1.y = 0;
        img1.height = this.app.view.height;
        img1.width = resource.texture.width * (this.app.view.height / resource.texture.height);
        this.app.stage.addChild(img1)         
        this.bindTouch()
    } 
}