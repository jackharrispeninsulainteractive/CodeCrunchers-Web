class PowerUp extends Entity{

    _rect;

    constructor(x,y) {
        super(x,y,26);
        this._rect = new Rectangle(x,y-16,64,64);
    }

    render(ctx){
        App.drawSprite(this._x*App.getScale(),this._y*App.getScale(),this._textureId);

        if(App.showDebug()){
            ctx.fillStyle = "rgba(255,255,0,0.5)";
            ctx.fillRect(this._rect.getX()*App.getScale()-App.getCameraOffsets().x,this._rect.getY()*App.getScale(),this._rect.getWidth(),this._rect.getHeight());
        }
    }

    update(){

        if(this._rect.intersects(App.getState("gameState")._player._hitBox)){
            if(App.getResource("SynthChime4.wav").currentTime > 0){
                App.getResource("SynthChime4.wav").currentTime = 0;
            }

            App.getResource("SynthChime4.wav").play();
            App.getState("gameState")._entities.delete(this._id);
            App.getState("gameState").addScore(10);
        }

    }

}