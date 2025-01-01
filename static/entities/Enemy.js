class Enemy extends Entity{

    _facing = 0;
    _speed = 2;
    _rect;

    constructor(x,y) {
        super(x,y,27);

        this._rect = new Rectangle(x,y-16,64,64);
    }

    update() {

        if(this._facing === 0){
            let nextFloorTile = App.getTileAtLocation(Math.round(this._x / 32) + 1, Math.round(this._y / 32)+1);
            let nextWallCheck = App.getTileAtLocation(Math.round(this._x / 32) + 1, Math.round(this._y / 32));

            if(nextFloorTile instanceof FloorTile && !nextWallCheck.isSolid()){
                this._x += this._speed;
            }else{
                this._facing = 1;
            }
        }else{
            let nextFloorTile = App.getTileAtLocation(Math.round(this._x / 32) - 1, Math.round(this._y / 32)+1);
            let nextWallCheck = App.getTileAtLocation(Math.round(this._x / 32) - 1, Math.round(this._y / 32));

            if(nextFloorTile instanceof FloorTile && !nextWallCheck.isSolid()){
                this._x-= this._speed;
            }else{
                this._facing = 0;
            }
        }

        this._rect.setX(this._x);

        if(this._rect.intersects(App.getState("gameState")._player._hitBox)){
            if(App.getResource("Hurt.wav").currentTime > 0){
                App.getResource("Hurt.wav").currentTime = 0;
            }
            console.log("Collision detected with player & enemy")
            App.getResource("Hurt.wav").play();
        }
    }

    render(ctx){
        App.drawSprite(this._x*App.getScale(),this._y*App.getScale(),this._textureId);

        if(App.showDebug()) {
            ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.fillRect(this._x*App.getScale() - App.getCameraOffsets().x + 64, this._y*App.getScale()  + 64 , 64, 64);
            ctx.fillRect(this._x*App.getScale()  - App.getCameraOffsets().x + 64, this._y*App.getScale()  , 64, 64);
            ctx.fillRect(this._x*App.getScale()  - App.getCameraOffsets().x - 64, this._y*App.getScale()  + 64 , 64, 64);
            ctx.fillRect(this._x*App.getScale()  - App.getCameraOffsets().x - 64, this._y*App.getScale()  , 64, 64);
            ctx.fillStyle = "rgba(255,255,0,0.5)";
            ctx.fillRect(this._rect.getX()*App.getScale()-App.getCameraOffsets().x,this._rect.getY()*App.getScale(),this._rect.getWidth(),this._rect.getHeight());

        }
    }

}