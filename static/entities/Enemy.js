class Enemy extends Entity{
    _facing = 0; // 0 = right, 1 = left
    _speed = 1.5; // 25% slower than original speed of 2
    _bodyHitbox; // Main body hitbox
    _damageHitbox; // Damage hitbox that will be positioned in front of enemy

    constructor(x,y) {
        super(x,y,27);

        // Main hitbox for the enemy body - make it match the sprite size
        this._bodyHitbox = new Rectangle(x, y, 32, 32);

        // Create a smaller damage hitbox - 50% width and 75% height of original
        // Width reduced from 32 to 16, height reduced from 32 to 24
        this._damageHitbox = new Rectangle(0, 0, 16, 24);

        // Position the damage hitbox initially
        this.updateDamageHitbox();
    }

    update() {
        const originalX = this._x;

        // Movement logic
        if(this._facing === 0){ // Moving right
            let nextFloorTile = App.getTileAtLocation(Math.round(this._x / 32) + 1, Math.round(this._y / 32)+1);
            let nextWallCheck = App.getTileAtLocation(Math.round(this._x / 32) + 1, Math.round(this._y / 32));

            if(nextFloorTile instanceof FloorTile && !nextWallCheck.isSolid()){
                this._x += this._speed;
            }else{
                this._facing = 1; // Change direction
            }
        }else{ // Moving left
            let nextFloorTile = App.getTileAtLocation(Math.round(this._x / 32) - 1, Math.round(this._y / 32)+1);
            let nextWallCheck = App.getTileAtLocation(Math.round(this._x / 32) - 1, Math.round(this._y / 32));

            if(nextFloorTile instanceof FloorTile && !nextWallCheck.isSolid()){
                this._x -= this._speed;
            }else{
                this._facing = 0; // Change direction
            }
        }

        // If we've moved, update hitboxes
        if (originalX !== this._x) {
            // Update hitboxes position
            this._bodyHitbox.setX(this._x);
            this._bodyHitbox.setY(this._y);

            // Update the damage hitbox position based on facing direction
            this.updateDamageHitbox();
        }

        // Check for collision with player
        if(this._damageHitbox.intersects(App.getState("gameState")._player._hitBox)){
            if(App.getResource("Hurt.wav").currentTime > 0){
                App.getResource("Hurt.wav").currentTime = 0;
            }
            console.log("Collision detected with player & enemy damage hitbox");
            App.getResource("Hurt.wav").play();

            //App.getState("gameState")._player.takeDamage();

        }
    }

    /**
     * Updates the damage hitbox position based on enemy facing direction
     */
    updateDamageHitbox() {
        if (this._facing === 0) { // Facing right
            // Position damage hitbox to the right of the enemy
            this._damageHitbox.setX(this._x + 32); // Right side of enemy
            // Align damage hitbox vertically with enemy's upper body - makes jumping over easier
            this._damageHitbox.setY(this._y + 4); // Slightly offset from top
        } else { // Facing left
            // Position damage hitbox to the left of the enemy
            this._damageHitbox.setX(this._x - 16); // Left side of enemy (accounting for smaller width)
            // Align damage hitbox vertically with enemy's upper body
            this._damageHitbox.setY(this._y + 4); // Slightly offset from top
        }
    }

    render(ctx){
        // Draw the enemy sprite
        App.drawSprite(this._x*App.getScale(), this._y*App.getScale(), this._textureId);

        // Show debug visualization if enabled
        if(App.showDebug()) {
            // Draw body hitbox in yellow
            ctx.fillStyle = "rgba(255,255,0,0.5)";
            ctx.fillRect(
                this._bodyHitbox.getX()*App.getScale()-App.getCameraOffsets().x,
                this._bodyHitbox.getY()*App.getScale()-App.getCameraOffsets().y,
                this._bodyHitbox.getWidth()*App.getScale(),
                this._bodyHitbox.getHeight()*App.getScale()
            );

            // Draw damage hitbox in red - only displayed in the direction enemy is facing
            ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.fillRect(
                this._damageHitbox.getX()*App.getScale()-App.getCameraOffsets().x,
                this._damageHitbox.getY()*App.getScale()-App.getCameraOffsets().y,
                this._damageHitbox.getWidth()*App.getScale(),
                this._damageHitbox.getHeight()*App.getScale()
            );
        }
    }
}