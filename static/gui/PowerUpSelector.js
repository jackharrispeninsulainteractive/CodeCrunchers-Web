class PowerUpSelector {

    _active;
    _x;
    _y;

    constructor() {

        this._active = false;

        const canvas = App.getCanvas();

        this._x = canvas.width / 2;
        this._y = canvas.height / 2;

        // Default configuration
        this.config = {
            radius: 320,                       // Outer radius of the wheel
            innerRadius: 100,                  // Inner radius (center circle)
            borderColor: '#ffffff',           // Wheel border color
            borderWidth: 2,                   // Wheel border width
            selectedSegmentGlow: '#ffffff',   // Glow color for selected segment
            font: '14px "Minecraft", monospace', // Font for labels
            fontColor: '#ffffff',             // Font color
            keyFont: 'bold 16px "Minecraft", monospace', // Font for key indicators
            segments: [                       // Wheel segments configuration
                { name: 'JUMP', color: '#4caf50', key: 'W' },
                { name: 'SPEED', color: '#2196f3', key: 'D'},
                { name: 'HEALTH', color: '#ff5252', key: 'S'},
                { name: 'ATTACK', color: '#ffc107', key: 'A'},

            ]
        };
    }

    show() {
        this._active = true;
        App.unPressKey("w");
        App.unPressKey("a");
        App.unPressKey("d");
    }

    update(){
        if (!this._active) return;

        let player = App.getState("gameState")._player;

        if(App.getKeyPress("w")){
            App.unPressKey("w");
            player._jumpHeight = player._jumpHeight+player._jumpHeight*0.25;
            this._active = false;
        }

        if(App.getKeyPress("a")){
            App.unPressKey("a");
            player._attackDamage = player._attackDamage+player._attackDamage*0.25;
            this._active = false;
        }

        if(App.getKeyPress("d")){
            App.unPressKey("d");
            player._moveSpeed = player._moveSpeed+player._moveSpeed*0.25;
            this._active = false;
        }

        if(App.getKeyPress("s")){
            App.unPressKey("s");
            player._health = player._health+player._health*0.25;
            this._active = false;
        }

    }

    render(ctx) {
        if (!this._active) return;

        // Get context through App facade
        const config = this.config;

        // Save the current context state
        ctx.save();

        // Draw the wheel background - more transparent for cross layout
        ctx.beginPath();
        ctx.arc(this._x,this._y, config.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // More transparent background for cross layout
        ctx.fill();
        ctx.lineWidth = config.borderWidth;
        ctx.strokeStyle = config.borderColor;
        ctx.stroke();

        // Center circle (decorative only now)
        ctx.beginPath();
        ctx.arc(this._x, this._y, config.innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();


        // Draw each segment
        config.segments.forEach((segment, index) => {

            // For cross layout, place in cardinal directions
            let segX, segY, keyX, keyY;
            const segmentDistance = config.radius * 0.65; // Slightly further out
            const keyDistance = config.radius + 15;

            if (index === 0) { // JUMP - Top (W)
                segX = this._x;
                segY = this._y - segmentDistance;
                keyX = this._x;
                keyY = this._y - keyDistance;
            } else if (index === 1) { // SPEED - Right (D)
                segX = this._x + segmentDistance;
                segY = this._y;
                keyX = this._x + keyDistance;
                keyY = this._y;
            } else if (index === 2) { // SHIELD - Bottom (S)
                segX = this._x;
                segY = this._y + segmentDistance;
                keyX = this._x;
                keyY = this._y + keyDistance;
            } else { // ATTACK - Left (A)
                segX = this._x - segmentDistance;
                segY = this._y;
                keyX = this._x - keyDistance;
                keyY = this._y;
            }

            // Draw segment box
            const boxSize = 160;
            const boxX = segX - boxSize / 2;
            const boxY = segY - boxSize / 2;

            // Draw segment box
            ctx.fillStyle = segment.color;
            ctx.fillRect(boxX, boxY, boxSize, boxSize);
            ctx.lineWidth = segment.selected ? 3 : 1;
            ctx.strokeRect(boxX, boxY, boxSize, boxSize);

            // Draw segment name
            ctx.fillStyle = config.fontColor;
            ctx.font = config.font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(segment.name, segX, segY);

            // Draw key indicator
            ctx.font = config.keyFont;
            ctx.fillStyle = config.fontColor;
            ctx.fillText(segment.key, keyX, keyY);

        });

        // Restore the context state
        ctx.restore();
    }
}