class Player extends Entity{
    _moveSpeed = 4;
    _jumping = false;
    _jumpHeight = 8; // Increased jump height
    _jumpCounter = 0;
    _maxJumpFrames = 20; // Controls how long the jump lasts

    _activeAnimation;
    _animations = {runningLeft: null, runningRight: null, idleLeft: null, idleRight: null, facing: 0}

    _showDebug = false;
    _grounded = false; // Track if player is on the ground

    _hitBox;

    _fallSpeed = 0;
    _maxFallSpeed = 12;
    _gravity = 0.5;


    constructor(x, y) {
        super(x, y, 32);

        this._animations.idleRight = new Animation([32,33,34,35,36,37], 240);
        this._animations.runningLeft = new Animation([56,57,58,59,60], 120);
        this._animations.runningRight = new Animation([48,49,50,51,52], 120);
        this._animations.idleLeft = new Animation([40,41,42,43,44,45], 240);

        this._activeAnimation = this._animations.idleRight;

        // Fix the hitbox size - make it properly match the player sprite
        // Width: 24 pixels (narrower than the sprite for forgiveness)
        // Height: 32 pixels (match player sprite height)
        this._hitBox = new Rectangle(x + 4, y, 24, 32);
    }

    update(){
        if(Kernel.instance.getKeyboardManager().keyPressed("F3")){
            this._showDebug = !this._showDebug;
            Kernel.instance.getKeyboardManager().unPress("F3");
        }

        // Store original position for collision resolution
        const originalX = this._x;
        const originalY = this._y;

        if(Kernel.instance.getKeyboardManager().keyPressed("a")){
            // Move player left
            this._activeAnimation = this._animations.runningLeft;
            this._animations.facing = 0;
            this._x -= this._moveSpeed;

            // Update hitbox position
            this._hitBox.setX(this._x + 4);

            // Check for collision with solid tiles
            const tileX = Math.floor(this._hitBox.getX() / 32);
            const tileY = Math.floor(this._y / 32);
            if(App.getTileAtLocation(tileX, tileY).isSolid()) {
                // Undo the movement if there was a collision
                this._x = originalX;
                this._hitBox.setX(originalX + 4);
            } else if (this._grounded) {
                App.getResource("Footstep.wav").play();
            }
        }

        if(Kernel.instance.getKeyboardManager().keyPressed("d")){
            // Move player right
            this._activeAnimation = this._animations.runningRight;
            this._animations.facing = 1;
            this._x += this._moveSpeed;

            // Update hitbox position
            this._hitBox.setX(this._x + 4);

            // Check for collision with solid tiles
            const tileX = Math.floor((this._hitBox.getX() + this._hitBox.getWidth()) / 32);
            const tileY = Math.floor(this._y / 32);
            if(App.getTileAtLocation(tileX, tileY).isSolid()) {
                // Undo the movement if there was a collision
                this._x = originalX;
                this._hitBox.setX(originalX + 4);
            } else if (this._grounded) {
                App.getResource("Footstep.wav").play();
            }
        }

        // Only allow jumping if the player released the W key since last jump
        // and is on the ground
        if(Kernel.instance.getKeyboardManager().keyPressed("w") && !this._jumping && this._grounded){
            this._jumping = true;
            this._jumpCounter = 0;
            App.getResource("Jump.wav").play();
            // Reset grounded state so player can't double jump
            this._grounded = false;
            // Reset fall speed at start of jump
            this._fallSpeed = 0;
        }

        if(Kernel.instance.getKeyboardManager().keyPressed("space")){
            App.getResource("Attack.wav").play();
        }

        // Keep hitbox in sync with player position
        this._hitBox.setX(this._x + 4);
        this._hitBox.setY(this._y);

        this.handleJump();
        this.handleGravity();
    }

    handleJump(){
        if(this._jumping){
            App.getResource("Footstep.wav").pause();

            // Check for collision with tile above
            const headTileX = Math.floor((this._x + 16) / 32); // center of player
            const headTileY = Math.floor(this._y / 32); // at player's head
            const above = App.getTileAtLocation(headTileX, headTileY);

            // Apply upward movement if there's no obstacle
            if(!above.isSolid() && this._jumpCounter < this._maxJumpFrames) {
                // Higher jump with decay as jump progresses
                const jumpPower = this._jumpHeight * (1 - (this._jumpCounter / this._maxJumpFrames));
                this._y -= jumpPower;
                this._jumpCounter++;

                // Update hitbox position
                this._hitBox.setY(this._y);
            } else {
                // End jump if we hit ceiling or reached max height
                this._jumping = false;
                this._fallSpeed = 0; // Reset fall speed to avoid immediate quick fall
            }
        }

        // If player releases W key during jump, end the jump early
        if(this._jumping && !Kernel.instance.getKeyboardManager().keyPressed("w")) {
            this._jumping = false;
        }
    }

    handleGravity(){
        // Don't apply gravity during active jump
        if (!this._jumping) {
            // Apply gravity
            this._fallSpeed = Math.min(this._fallSpeed + this._gravity, this._maxFallSpeed);
        } else {
            // During jump, cap the fall speed at 0 (no gravity effect)
            this._fallSpeed = 0;
        }

        // Store current position for collision resolution
        let newY = this._y + this._fallSpeed;

        // Update hitbox with potential new Y position for collision check
        const tempHitbox = {
            x: this._hitBox.getX(),
            y: newY,
            width: this._hitBox.getWidth(),
            height: this._hitBox.getHeight()
        };

        // Check feet collision points
        const leftFoot = {x: tempHitbox.x + 4, y: tempHitbox.y + tempHitbox.height};
        const rightFoot = {x: tempHitbox.x + tempHitbox.width - 4, y: tempHitbox.y + tempHitbox.height};
        const centerFoot = {x: tempHitbox.x + (tempHitbox.width / 2), y: tempHitbox.y + tempHitbox.height};

        let collision = false;
        let collidedY = 0;

        // Check each foot point
        for (const foot of [leftFoot, centerFoot, rightFoot]) {
            const tileX = Math.floor(foot.x / 32);
            const tileY = Math.floor(foot.y / 32);
            const tile = App.getTileAtLocation(tileX, tileY);

            if (tile instanceof FloorTile) {
                collision = true;
                collidedY = tileY * 32 - tempHitbox.height;
                break;
            }
        }

        // Update position based on collision
        if (collision) {
            this._y = collidedY;
            this._fallSpeed = 0;
            this._grounded = true; // Player is on the ground

            // If we were jumping and landed, stop jumping
            if (this._jumping) {
                this._jumping = false;
            }
        } else {
            this._y = newY;
            this._grounded = false; // Player is in the air
        }

        // Keep hitbox in sync with final player position
        this._hitBox.setY(this._y);

        if (this._y > 800) {
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
        // Draw the player sprite
        if(!Kernel.instance.getKeyboardManager().keyPressed("a") && this._animations.facing === 0){
            this._activeAnimation = this._animations.idleLeft;
        }

        if(!Kernel.instance.getKeyboardManager().keyPressed("d") && this._animations.facing === 1){
            this._activeAnimation = this._animations.idleRight;
        }

        this._activeAnimation.render(ctx, this._x*App.getScale(), this._y*App.getScale());

        // Draw debug information
        if(this._showDebug) {
            // Draw hitbox
            ctx.fillStyle = "rgba(255,255,0,0.5)";
            ctx.fillRect(
                this._hitBox.getX()*App.getScale()-App.getCameraOffsets().x,
                this._hitBox.getY()*App.getScale()-App.getCameraOffsets().y,
                this._hitBox.getWidth()*App.getScale(),
                this._hitBox.getHeight()*App.getScale()
            );

            // Setup text rendering
            ctx.font = "16px Minecraft";
            ctx.fillStyle = "white";

            // Render debug text with our helper function
            this.renderDebugText(ctx, [
                "Code Crunchers Web dev 0.1",
                `FPS: ${App.getStatistics().Fps}`,
                `World size: ${App.getLevelGenerator().getWorld().length} total tiles, ${App.getLevelGenerator().getWorldWidth()} tiles x ${App.getLevelGenerator().getWorldHeight()} tiles`,
                `Entity Count: ${App.getState("gameState")._entities.size}`,
                `Time: ${(App.getState("gameState")._seconds/100).toFixed(2)}`,
                `Player: (${Math.round(this._x)}, ${Math.round(this._y)})`,
                `Hitbox: (${Math.round(this._hitBox.getX())}, ${Math.round(this._hitBox.getY())}, ${this._hitBox.getWidth()}x${this._hitBox.getHeight()})`,
                `Velocity: ${this._fallSpeed.toFixed(2)}`,
                `Jumping: ${this._jumping ? "Yes" : "No"}`,
                `Grounded: ${this._grounded ? "Yes" : "No"}`,
                `Jump Counter: ${this._jumpCounter}`
            ]);
        }
    }

    /**
     * Helper function to render debug text with consistent spacing
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     * @param {string[]} lines - Array of text lines to render
     * @param {number} x - Starting X position (default: 32)
     * @param {number} y - Starting Y position (default: 32)
     * @param {number} lineHeight - Space between lines (default: 20)
     */
    renderDebugText(ctx, lines, x = 32, y = 32, lineHeight = 20) {
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * lineHeight));
        });
    }
}