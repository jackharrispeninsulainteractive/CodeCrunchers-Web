class Player extends Entity {
    _moveSpeed = 4;
    _jumping = false;
    _jumpHeight = 8;
    _jumpCounter = 0;
    _maxJumpFrames = 20;

    _activeAnimation;
    _animations = {runningLeft: null, runningRight: null, idleLeft: null, idleRight: null, facing: 0, attackingLeft: null, attackingRight: null};

    _showDebug = false;
    _grounded = false;

    _hitBox;
    _attackBox;
    _isAttacking = false;
    _attackDuration = 20;
    _attackTimer = 0;
    _attackCooldown = 30;
    _attackCooldownTimer = 0;

    _fallSpeed = 0;
    _maxFallSpeed = 12;
    _gravity = 0.5;

    constructor(x, y) {
        super(x, y, 32);

        // Set default cooldowns for player
        this.setDamageCooldown(2); // 2 second invulnerability after taking damage
        this.setDamageDealtCooldown(1.5); // 2.5 seconds between damaging the same enemy

        // Initialize animations
        this._animations.idleRight = new Animation([32,33,34,35,36,37], 240);
        this._animations.runningLeft = new Animation([56,57,58,59,60], 120);
        this._animations.runningRight = new Animation([48,49,50,51,52], 120);
        this._animations.idleLeft = new Animation([40,41,42,43,44,45], 240);
        this._animations.attackingLeft = new Animation([64,65,66,67,68], 60);
        this._animations.attackingRight = new Animation([72,73,74,75,76], 60);

        this._activeAnimation = this._animations.idleRight;

        // Initialize hitboxes
        this._hitBox = new Rectangle(x + 4, y, 24, 32);
        this._attackBox = new Rectangle(0, 0, 20, 20);
    }

    update() {
        // Call parent update for common functionality (like invulnerability)
        super.update();

        // Toggle debug mode
        if(Kernel.instance.getKeyboardManager().keyPressed("F3")) {
            this._showDebug = !this._showDebug;
            Kernel.instance.getKeyboardManager().unPress("F3");
        }

        if(!this.isAlive()) {
            this.die();
        }

        // Store original position for collision resolution
        const originalX = this._x;

        let isMoving = this.handleMovement(originalX);
        this.updateAnimation(isMoving);

        // Jump logic
        if(Kernel.instance.getKeyboardManager().keyPressed("w") && !this._jumping && this._grounded) {
            this.startJump();
        }

        // Attack logic
        if(Kernel.instance.getKeyboardManager().keyPressed("space") && !this._isAttacking && this._attackCooldownTimer <= 0) {
            this.startAttack(isMoving);
        }

        // Update attack state
        this.handleAttack();

        // Keep hitbox in sync with player position
        this._hitBox.setX(this._x + 4);
        this._hitBox.setY(this._y);

        this.handleJump();
        this.handleGravity();

        // Update attack hitbox position
        this.updateAttackHitbox();

        // Check for enemy collisions with attack hitbox if attacking
        if (this._isAttacking) {
            this.checkAttackCollisions();
        }
    }

    /**
     * Handles player movement and collision
     * @param {number} originalX - Original X position before movement
     * @returns {boolean} - Whether the player is moving
     */
    handleMovement(originalX) {
        let isMoving = false;

        // Left movement
        if(Kernel.instance.getKeyboardManager().keyPressed("a")) {
            this._animations.facing = 0;
            this._x -= this._moveSpeed;
            isMoving = true;

            this._hitBox.setX(this._x + 4);

            // Check collision
            const tileX = Math.floor(this._hitBox.getX() / 32);
            const tileY = Math.floor(this._y / 32);

            if(App.getTileAtLocation(tileX, tileY).isSolid()) {
                this._x = originalX;
                this._hitBox.setX(originalX + 4);
                isMoving = false;
            } else if (this._grounded) {
                App.getResource("Footstep.wav").play();
            }
        }

        // Right movement
        if(Kernel.instance.getKeyboardManager().keyPressed("d")) {
            this._animations.facing = 1;
            this._x += this._moveSpeed;
            isMoving = true;

            this._hitBox.setX(this._x + 4);

            // Check collision
            const tileX = Math.floor((this._hitBox.getX() + this._hitBox.getWidth()) / 32);
            const tileY = Math.floor(this._y / 32);

            if(App.getTileAtLocation(tileX, tileY).isSolid()) {
                this._x = originalX;
                this._hitBox.setX(originalX + 4);
                isMoving = false;
            } else if (this._grounded) {
                App.getResource("Footstep.wav").play();
            }
        }

        return isMoving;
    }

    /**
     * Start jump action
     */
    startJump() {
        this._jumping = true;
        this._jumpCounter = 0;
        App.getResource("Jump.wav").play();
        this._grounded = false;
        this._fallSpeed = 0;
    }

    /**
     * Start attack action
     */
    startAttack(isMoving) {
        this._isAttacking = true;
        this._attackTimer = this._attackDuration;
        this.updateAnimation(isMoving);
        App.getResource("Attack.wav").play();
    }

    /**
     * Updates the player's animation based on movement and attacking status
     */
    updateAnimation(isMoving) {
        if (this._isAttacking) {
            // Attack animations have inverted facing (fixed bug)
            if (this._animations.facing === 0) {
                this._activeAnimation = this._animations.attackingRight;
            } else {
                this._activeAnimation = this._animations.attackingLeft;
            }
        } else {
            // Normal movement animations
            if (isMoving) {
                this._activeAnimation = this._animations.facing === 0 ?
                    this._animations.runningLeft : this._animations.runningRight;
            } else {
                this._activeAnimation = this._animations.facing === 0 ?
                    this._animations.idleLeft : this._animations.idleRight;
            }
        }
    }

    /**
     * Handles attack state and cooldown
     */
    handleAttack() {
        // Update attack cooldown timer
        if (this._attackCooldownTimer > 0) {
            this._attackCooldownTimer--;
        }

        // If attacking, update attack timer
        if (this._isAttacking) {
            if (this._attackTimer > 0) {
                this._attackTimer--;
            } else {
                // Attack finished
                this._isAttacking = false;
                this._attackCooldownTimer = this._attackCooldown;
            }
        }
    }

    /**
     * Updates the position of the attack hitbox based on player's facing direction
     */
    updateAttackHitbox() {
        if (this._animations.facing === 1) { // Facing right
            this._attackBox.setX(this._x + this._hitBox.getWidth());
            this._attackBox.setY(this._y + 6);
        } else { // Facing left
            this._attackBox.setX(this._x - this._attackBox.getWidth());
            this._attackBox.setY(this._y + 6);
        }
    }

    /**
     * Checks for collisions between the attack hitbox and enemies
     */
    checkAttackCollisions() {
        const entities = App.getState("gameState")._entities;

        entities.forEach(entity => {
            if (entity instanceof Enemy && entity._bodyHitbox) {
                // Check if attack hitbox intersects with enemy
                if (this._attackBox.intersects(entity._bodyHitbox)) {
                    // Attempt to damage the enemy with cooldown check
                    const damageDealt = this.attemptDamage(entity, 25);

                    // Only add score and play sound if damage was actually dealt
                    if (damageDealt) {
                        App.getState("gameState").addScore(50);

                        // Play sound
                        if (App.getResource("EnemyDefeated.wav")) {
                            App.getResource("EnemyDefeated.wav").play();
                        } else {
                            App.getResource("Attack.wav").play();
                        }
                    }
                }
            }
        });
    }

    handleJump() {
        if(this._jumping) {
            App.getResource("Footstep.wav").pause();

            // Check for collision with tile above
            const headTileX = Math.floor((this._x + 16) / 32);
            const headTileY = Math.floor(this._y / 32);
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
                this._fallSpeed = 0;
            }
        }

        // If player releases W key during jump, end the jump early
        if(this._jumping && !Kernel.instance.getKeyboardManager().keyPressed("w")) {
            this._jumping = false;
        }
    }

    handleGravity() {
        // Apply gravity (unless jumping)
        if (!this._jumping) {
            this._fallSpeed = Math.min(this._fallSpeed + this._gravity, this._maxFallSpeed);
        } else {
            this._fallSpeed = 0;
        }

        // Calculate new position
        let newY = this._y + this._fallSpeed;
        const tempHitbox = {
            x: this._hitBox.getX(),
            y: newY,
            width: this._hitBox.getWidth(),
            height: this._hitBox.getHeight()
        };

        // Check for floor collisions
        const collisionPoints = [
            {x: tempHitbox.x + 4, y: tempHitbox.y + tempHitbox.height},                    // Left foot
            {x: tempHitbox.x + tempHitbox.width - 4, y: tempHitbox.y + tempHitbox.height}, // Right foot
            {x: tempHitbox.x + (tempHitbox.width / 2), y: tempHitbox.y + tempHitbox.height}// Center foot
        ];

        let collision = false;
        let collidedY = 0;

        // Check each foot point
        for (const point of collisionPoints) {
            const tileX = Math.floor(point.x / 32);
            const tileY = Math.floor(point.y / 32);
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
            this._grounded = true;

            if (this._jumping) {
                this._jumping = false;
            }
        } else {
            this._y = newY;
            this._grounded = false;
        }

        // Keep hitbox in sync with final player position
        this._hitBox.setY(this._y);

        // Handle falling off the map
        if (this._y > 800) {
            this.die();
        }
    }

    die() {
        if(App.getResource("Hurt.wav").currentTime > 0) {
            App.getResource("Hurt.wav").currentTime = 0;
        }
        App.getResource("Hurt.wav").play();
        App.getState("gameState").endGame();
    }

    render(ctx) {
        // Check if player should be visible during invulnerability flash
        if (this.shouldDrawWhenFlashing()) {
            // Draw the player sprite
            this._activeAnimation.render(ctx, this._x * App.getScale(), this._y * App.getScale());
        }

        if (this._showDebug) {
            this.renderDebugInfo(ctx);
        }

        // Render health bar with green foreground
        this.renderHealth(ctx, "#00ff00", "#ff0000");
    }

    /**
     * Renders debug visualization and information
     */
    renderDebugInfo(ctx) {
        // Draw player hitbox
        ctx.fillStyle = "rgba(255,255,0,0.5)";
        ctx.fillRect(
            this._hitBox.getX() * App.getScale() - App.getCameraOffsets().x,
            this._hitBox.getY() * App.getScale() - App.getCameraOffsets().y,
            this._hitBox.getWidth() * App.getScale(),
            this._hitBox.getHeight() * App.getScale()
        );

        // Draw attack hitbox if attacking
        if (this._isAttacking) {
            ctx.fillStyle = "rgba(0,100,255,0.7)";
            ctx.fillRect(
                this._attackBox.getX() * App.getScale() - App.getCameraOffsets().x,
                this._attackBox.getY() * App.getScale() - App.getCameraOffsets().y,
                this._attackBox.getWidth() * App.getScale(),
                this._attackBox.getHeight() * App.getScale()
            );
        }

        // Setup text rendering
        ctx.font = "16px Minecraft";
        ctx.fillStyle = "white";

        // Get current animation name for debug display
        const animName =
            this._activeAnimation === this._animations.attackingLeft ? "attackingLeft" :
                this._activeAnimation === this._animations.attackingRight ? "attackingRight" :
                    this._activeAnimation === this._animations.idleLeft ? "idleLeft" :
                        this._activeAnimation === this._animations.idleRight ? "idleRight" :
                            this._activeAnimation === this._animations.runningLeft ? "runningLeft" :
                                this._activeAnimation === this._animations.runningRight ? "runningRight" : "unknown";

        this.renderDebugText(ctx, [
            "Code Crunchers Web dev 0.1",
            `FPS: ${App.getStatistics().Fps}`,
            `World size: ${App.getLevelGenerator().getWorld().length} total tiles, ${App.getLevelGenerator().getWorldWidth()} tiles x ${App.getLevelGenerator().getWorldHeight()} tiles`,
            `Entity Count: ${App.getState("gameState")._entities.size}`,
            `Time: ${(App.getState("gameState")._seconds / 100).toFixed(2)}`,
            `Player: (${Math.round(this._x)}, ${Math.round(this._y)})`,
            `Hitbox: (${Math.round(this._hitBox.getX())}, ${Math.round(this._hitBox.getY())}, ${this._hitBox.getWidth()}x${this._hitBox.getHeight()})`,
            `Attack: (${Math.round(this._attackBox.getX())}, ${Math.round(this._attackBox.getY())}, ${this._attackBox.getWidth()}x${this._attackBox.getHeight()})`,
            `Velocity: ${this._fallSpeed.toFixed(2)}`,
            `Jumping: ${this._jumping ? "Yes" : "No"}`,
            `Grounded: ${this._grounded ? "Yes" : "No"}`,
            `Attacking: ${this._isAttacking ? "Yes" : "No"}`,
            `Attack Timer: ${this._attackTimer}`,
            `Attack Cooldown: ${this._attackCooldownTimer}`,
            `Current Animation: ${animName}`
        ]);
    }

    /**
     * Helper function to render debug text with consistent spacing
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string[]} lines - Lines of text to render
     * @param {number} x - X position for text
     * @param {number} y - Y position for text
     * @param {number} lineHeight - Spacing between lines
     */
    renderDebugText(ctx, lines, x = 32, y = 32, lineHeight = 20) {
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * lineHeight));
        });
    }
}