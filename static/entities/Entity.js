class Entity {

    _x
    _y;
    _width;
    _height;
    _id;

    _textureId;
    _health = 100;

    constructor(x,y, textureId) {
        this._x = x;
        this._y = y;
        this._textureId = textureId;
    }

    update(){
        //ABSTRACT METHOD
    }

    render(ctx){
        //ABSTRACT METHOD
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

    takeDamage(damage){
        this._health -= damage;
    }

    renderHealth(ctx,foregroundColor,backgroundColor) {
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

        // Draw health bar (red for empty space)
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(
            screenX,
            screenY,
            barWidth * App.getScale(),
            barHeight * App.getScale()
        );

        // Draw current health (green overlay)
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