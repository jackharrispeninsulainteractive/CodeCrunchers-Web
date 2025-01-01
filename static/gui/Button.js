class Button extends InterfaceObject{

    _callbackFunction;

    constructor() {
        super();
    }

    setOnClick(callbackFunction){
        this._callbackFunction = callbackFunction;
    }

    render(ctx){
        let last = 0;
        while(last < this._width){

            if(last === 0){
                App.drawSprite(this._x+(App.getTileSize()*App.getScale()*last),this._y,0,true)
            }else if(last === this._width-1){
                App.drawSprite(this._x+(App.getTileSize()*App.getScale()*last),this._y,2,true)
            }else{
                App.drawSprite(this._x+(App.getTileSize()*App.getScale()*last),this._y,1,true)
            }

            last++;
        }

        let beforeColor = ctx.fillStyle;

        if(this._hovering) {
            ctx.fillStyle = "rgba(131, 131, 131, 0.8)";
            ctx.fillRect(this._x,this._y,this._width*(App.getTileSize()*App.getScale()),App.getTileSize()*App.getScale());

        }

        ctx.fillStyle = beforeColor;
        ctx.fillStyle = "black";

        let width = ctx.measureText(this._text).width;

        ctx.fillText(this._text, this._x+(App.getTileSize()*App.getScale())*this._width/2-width/2, this._y+App.getTileSize()*App.getScale()/2);
    }

    update() {
        super.update();

        if(this._hovering && App.checkMousePressed("left")){
            App.getResource("UI_Quirky21.wav").play();
            App.resetMouseButtonPress("left");
            this._callbackFunction();
        }

    }

}