class Player extends Entity{


    _moveSpeed =4;
    _jumping = false;
    _jumpCountdown = 30;

    _activeAnimation;
    _animations = {runningLeft: null, runningRight: null, idleLeft: null, idleRight: null, facing: 0}

    _showDebug = false;

    _hitBox;

    _fallSpeed = 0;
    _maxFallSpeed = 12;
    _gravity = 0.5;


    constructor(x,y) {
        super(x,y,32);

        this._animations.idleRight = new Animation([32,33,34,35,36,37],240);
        this._animations.runningLeft = new Animation([56,57,58,59,60],120);
        this._animations.runningRight = new Animation([48,49,50,51,52],120);
        this._animations.idleLeft = new Animation([40,41,42,43,44,45],240)

        this._activeAnimation = this._animations.idleRight;

        this._hitBox = new Rectangle(x,y,32,96);
    }

    update(){

        if(Kernel.instance.getKeyboardManager().keyPressed("F3")){
            this._showDebug = !this._showDebug;
            Kernel.instance.getKeyboardManager().unPress("F3")
        }

        if(Kernel.instance.getKeyboardManager().keyPressed("a")){

            this._hitBox.setX(this._x-24);

            if(!App.getTileAtLocation(this._hitBox.getX()/32,Math.round(this._y/32)).isSolid()){
                this._activeAnimation = this._animations.runningLeft;
                this._animations.facing = 0;
                this._x -= this._moveSpeed;
                App.getResource("Footstep.wav").play();
            }else{
                //Else undo the move
                this._hitBox.setX(this._x+8);
            }

        }

        if(Kernel.instance.getKeyboardManager().keyPressed("d")){

            this._hitBox.setX(this._x+8);

            if(!App.getTileAtLocation(Math.round(this._hitBox.getX()/32),Math.round(this._y/32)).isSolid()){
                this._activeAnimation = this._animations.runningRight;
                this._animations.facing = 1;
                this._x += this._moveSpeed;
                App.getResource("Footstep.wav").play();
            }else{
                //Else undo the movement
                this._hitBox.setX(this._x - 8);
            }

        }

        let below = App.getTileAtLocation(Math.round(this._x/32),Math.round(this._y/32)+1);

        if(Kernel.instance.getKeyboardManager().keyPressed("w") && !this._jumping && below instanceof FloorTile){
            this._jumping = true;
            App.getResource("Jump.wav").play();
        }


        if(Kernel.instance.getKeyboardManager().keyPressed("space")){
            App.getResource("Attack.wav").play();
        }

        this._hitBox.setX(this._x);
        this._hitBox.setY(this._y);

        this.jump();
        this.fall();
    }

    jump(){

        let above = App.getTileAtLocation(Math.round(this._x/32),Math.round(this._y/32)-1);

        if(this._jumping){
            App.getResource("Footstep.wav").pause();

            if(!above.isSolid()) {
                this._y -= this._jumpCountdown;
                this._jumpCountdown--;

            }else{
                this._jumpCountdown = 0;
            }

        }

        if(this._jumpCountdown < 0){
            this._jumping = false;
            this._jumpCountdown = 30;
        }

    }

    fall(){
        // Apply gravity
        this._fallSpeed = Math.min(this._fallSpeed + this._gravity, this._maxFallSpeed);

        // Store current position for collision resolution
        let newY = this._y + this._fallSpeed;

        // Collision check points at the feet level
        const checkPoints = [
            {x: this._x + 8, y: newY + 32},  // Left foot
            {x: this._x + 24, y: newY + 32}, // Right foot
            {x: this._x + 16, y: newY + 32}  // Center foot
        ];

        let collision = false;

        for (let point of checkPoints) {
            const tileX = Math.floor(point.x / 32);
            const tileY = Math.floor(point.y / 32);
            const below = App.getTileAtLocation(tileX, tileY);

            if (below instanceof FloorTile) {
                collision = true;
                // Align precisely to the top of the tile
                newY = (tileY * 32) - 32; // 32 is player height
                this._fallSpeed = 0;
                break;
            }
        }

        // Update positions
        this._y = newY;

        // Keep hitbox in sync with player position
        this._hitBox.setX(this._x + 4); // Offset for narrower hitbox
        this._hitBox.setY(this._y);

        if (this._y > 800) {
            this.die();
        }
    }

    fallOld(){
        this._hitBox.setY(this._y + 16);

        let below = App.getTileAtLocation(Math.round(this._hitBox.getX()/32),Math.round(this._hitBox.getY()/32));

        if(!(below instanceof FloorTile)){
            this._y +=8;
        }else{
            this._hitBox.setY(this._y - 8);
        }

        if(this._y > 800){
            this.die();
        }
    }

    die(){

        if(App.getResource("Hurt.wav").currentTime > 0){
            App.getResource("Hurt.wav").currentTime = 0;
        }
        App.getResource("Hurt.wav").play();
        App.getState("gameState").endGame();
    }

    render(ctx) {

        if(this._showDebug){
            ctx.font = "16px Minecraft";

            ctx.fillStyle = "white";

            ctx.fillText("Code Crunchers Web dev 0.1", 32, 32);
            ctx.fillText("FPS: " + App.getStatistics().Fps, 32, 48+4);
            ctx.fillText("World size: " + App.getLevelGenerator().getWorld().length+" total tiles, "+App.getLevelGenerator().getWorldWidth()+" tiles  x "+App.getLevelGenerator().getWorldHeight()+" tiles", 32, 64+6);
            ctx.fillText("Entity Count: " + App.getState("gameState")._entities.size, 32, 80+8);
        }

        if(!Kernel.instance.getKeyboardManager().keyPressed("a") && this._animations.facing === 0){
            this._activeAnimation = this._animations.idleLeft;
        }

        if(!Kernel.instance.getKeyboardManager().keyPressed("d") && this._animations.facing === 1){
            this._activeAnimation = this._animations.idleRight;
        }

        this._activeAnimation.render(ctx,this._x*App.getScale(),this._y*App.getScale());


        if(this._showDebug) {
            ctx.fillStyle = "rgba(255,255,0,0.5)";

            ctx.fillRect(this._hitBox.getX()*App.getScale()-App.getCameraOffsets().x,this._hitBox.getY()*App.getScale(),this._hitBox.getWidth(),this._hitBox.getHeight());
            //ctx.fillRect(this._hitBox.getX()*App.getScale()-App.getCameraOffsets().x,this._y*App.getScale(),this._hitBox.getWidth(),8);

        }

    }

}