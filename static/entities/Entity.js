class Entity {
    _x;
    _y;
    _width;
    _height;
    _id;
    _textureId;
    _health = 100;

    // Damage cooldown properties (for receiving damage)
    _lastDamageTime = 0;
    _damageCooldown = 2000; // 2 seconds cooldown by default
    _isInvulnerable = false;
    _invulnerabilityFlashTimer = 0;
    _invulnerabilityFlashInterval = 6; // Flash every 6 frames

    // Track damage dealt cooldowns (maps target ID to timestamp)
    _damageDealtCooldowns = new Map();
    _damageDealtCooldownTime = 2500; // 2.5 seconds cooldown for dealing damage

    constructor(x, y, textureId) {
        this._x = x;
        this._y = y;
        this._textureId = textureId;
    }

    update(){
        // ABSTRACT METHOD

        // Update invulnerability state
        this.updateInvulnerability();
    }

    render(ctx){
        // ABSTRACT METHOD
    }

    isAlive(){
        return this._health > 0;
    }

    getX(){
        return this._x;
    }

    getY(){
        return this._y;
    }

    setId(id){
        this._id = id;
    }

    /**
     * Override takeDamage method to implement cooldown
     * @param {number} damage - Amount of damage to take
     * @returns {boolean} - Whether damage was actually applied
     */
    takeDamage(damage){
        // Check if entity is currently invulnerable
        if (this._isInvulnerable) {
            return false; // Skip damage if invulnerable
        }

        // Apply damage
        this._health -= damage;

        // Start invulnerability period
        this._isInvulnerable = true;
        this._lastDamageTime = Date.now();
        this._invulnerabilityFlashTimer = 0;

        return true; // Damage was applied
    }

    /**
     * Update invulnerability state
     */
    updateInvulnerability() {
        if (this._isInvulnerable) {
            // Check if invulnerability period has ended
            const currentTime = Date.now();
            if (currentTime - this._lastDamageTime >= this._damageCooldown) {
                this._isInvulnerable = false;
            }

            // Update flash timer for visual feedback
            this._invulnerabilityFlashTimer++;
        }
    }

    /**
     * Check if this entity can damage a specific target based on cooldown
     * @param {string} targetId - The ID of the target entity
     * @returns {boolean} - Whether the target can be damaged
     */
    canDamageTarget(targetId) {
        const currentTime = Date.now();
        const lastDamageTime = this._damageDealtCooldowns.get(targetId) || 0;

        return (currentTime - lastDamageTime) >= this._damageDealtCooldownTime;
    }

    /**
     * Record that this entity damaged a target
     * @param {string} targetId - The ID of the target that was damaged
     */
    recordDamageDealt(targetId) {
        this._damageDealtCooldowns.set(targetId, Date.now());
    }

    /**
     * Attempt to damage a target entity with cooldown check
     * @param {Entity} target - The target entity to damage
     * @param {number} damageAmount - Amount of damage to deal
     * @returns {boolean} - Whether damage was applied
     */
    attemptDamage(target, damageAmount) {
        // Check if cooldown has expired for this target
        if (this.canDamageTarget(target._id)) {
            // Apply damage
            const damageApplied = target.takeDamage(damageAmount);

            // Only record cooldown if damage was actually applied
            if (damageApplied) {
                this.recordDamageDealt(target._id);
                return true;
            }
        }

        return false;
    }

    /**
     * Set the damage cooldown time in seconds (invulnerability period)
     * @param {number} seconds - Cooldown time in seconds
     */
    setDamageCooldown(seconds) {
        this._damageCooldown = seconds * 1000; // Convert to milliseconds
    }

    /**
     * Set the damage dealt cooldown time in seconds
     * @param {number} seconds - Cooldown time in seconds
     */
    setDamageDealtCooldown(seconds) {
        this._damageDealtCooldownTime = seconds * 1000; // Convert to milliseconds
    }

    /**
     * Returns whether the entity should be drawn when flashing
     * @returns {boolean} - True if entity should be visible
     */
    shouldDrawWhenFlashing() {
        return !this._isInvulnerable ||
            (this._invulnerabilityFlashTimer % this._invulnerabilityFlashInterval >=
                Math.floor(this._invulnerabilityFlashInterval / 2));
    }

    renderHealth(ctx, foregroundColor = "#00ff00", backgroundColor = "#ff0000") {
        // Calculate positions relative to the camera
        const barWidth = 32; // Base width of health bar
        const barHeight = 5; // Height of health bar
        const yOffset = -10; // Position above the entity

        // Calculate the position in world coordinates
        const screenX = this._x * App.getScale() - App.getCameraOffsets().x;
        const screenY = (this._y + yOffset) * App.getScale() - App.getCameraOffsets().y;

        // Draw background (black outline/background)
        ctx.fillStyle = "#000000";
        ctx.fillRect(
            screenX - 1,
            screenY - 1,
            (barWidth * App.getScale()) + 2,
            (barHeight * App.getScale()) + 2
        );

        // Draw health bar (background color for empty space)
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(
            screenX,
            screenY,
            barWidth * App.getScale(),
            barHeight * App.getScale()
        );

        // Draw current health (foreground color overlay)
        const healthPercentage = this._health / 100; // Assuming max health is 100
        ctx.fillStyle = foregroundColor;
        ctx.fillRect(
            screenX,
            screenY,
            barWidth * App.getScale() * healthPercentage,
            barHeight * App.getScale()
        );
    }
}