class PowerUp extends Entity{

    _rect;

    constructor(x,y) {
        super(x,y,26);
        // Make the hitbox smaller and position it to match the visual gem
        // Assuming the gem sprite is roughly 32x32 pixels
        this._rect = new Rectangle(x, y, 32, 32);
    }

    render(ctx){
        // Draw the sprite
        App.drawSprite(this._x*App.getScale(), this._y*App.getScale(), this._textureId);

        if(App.showDebug()){
            // Draw the collision box exactly as it's used for collision detection
            ctx.fillStyle = "rgba(255,255,0,0.5)";
            ctx.fillRect(
                this._rect.getX()*App.getScale()-App.getCameraOffsets().x,
                this._rect.getY()*App.getScale()-App.getCameraOffsets().y,
                this._rect.getWidth()*App.getScale(),
                this._rect.getHeight()*App.getScale()
            );
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

            App.getState("gameState")._powerUpSelector.show();
        }
    }
}