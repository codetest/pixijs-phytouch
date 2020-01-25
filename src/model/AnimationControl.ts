import * as PIXI from "pixi.js"
import Vue from "vue"
import { isNullOrUndefined } from "util";
const PhyTouch = require("phy-touch")

export class AnimationControl{
    private instance:Vue;
    private app: PIXI.Application;
    private loader: PIXI.Loader;
    private canvasId: string = "canvas"
    private offset: number = 0
    constructor(instance: Vue){
        this.instance = instance;
        this.app = new PIXI.Application({ 
			width: window.innerWidth, 
			height: window.innerWidth,       
			transparent: false, 
			resolution: 1
        });
        this.app.view.id = this.canvasId
        this.instance.$el.appendChild(this.app.view)
        this.loader = new PIXI.Loader();
        this.loader.add("1.jpg")
		.load(() => {this.setup()});
    }

    setup(){
        var resource = this.loader.resources["1.jpg"]
        var newWidth = resource.texture.width * (this.app.view.height / resource.texture.height);
        var img = new PIXI.Sprite(resource.texture);
        img.height = this.app.view.height;
        img.width = newWidth
        this.app.stage.addChild(img)
        new PhyTouch({
            touch:"#app",
            vertical: false,
            property: "translateX",
            value: 0,
            step: 1,
            max: 0,
            min: -newWidth + window.innerWidth,
            change: (value: number)=>{
                if (isNaN(value) || isNullOrUndefined(value)){
                    return;
                }

                if (value > 0){
                    return;
                }
                else if (value < -newWidth + window.innerWidth){
                    return;
                }

                this.app.stage.x = value
            }
        })      
    } 
}