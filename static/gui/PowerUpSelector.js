class PowerUpSelector {

    _active;

    constructor() {

        this._active = false;

        const canvas = App.getCanvas();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Default configuration
        this.config = {
            radius: 320,                       // Outer radius of the wheel
            x: centerX,
            y: centerY,
            innerRadius: 100,                  // Inner radius (center circle)
            borderColor: '#ffffff',           // Wheel border color
            borderWidth: 2,                   // Wheel border width
            selectedSegmentGlow: '#ffffff',   // Glow color for selected segment
            font: '14px "Minecraft", monospace', // Font for labels
            fontColor: '#ffffff',             // Font color
            keyFont: 'bold 16px "Minecraft", monospace', // Font for key indicators
            active: false,                    // Is the wheel currently displayed?
            timeScale: 0.5,                   // Game time scale when wheel is active (0.5 = half speed)
            segments: [                       // Wheel segments configuration
                { name: 'JUMP', color: '#4caf50', key: 'W' },
                { name: 'ATTACK', color: '#ffc107', key: 'A'},
                { name: 'HEALTH', color: '#ff5252', key: 'S'},
                { name: 'SPEED', color: '#2196f3', key: 'D'}

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
        ctx.arc(config.x, config.y, config.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // More transparent background for cross layout
        ctx.fill();
        ctx.lineWidth = config.borderWidth;
        ctx.strokeStyle = config.borderColor;
        ctx.stroke();

        // Center circle (decorative only now)
        ctx.beginPath();
        ctx.arc(config.x, config.y, config.innerRadius, 0, Math.PI * 2);
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
                segX = config.x;
                segY = config.y - segmentDistance;
                keyX = config.x;
                keyY = config.y - keyDistance;
            } else if (index === 1) { // SPEED - Right (D)
                segX = config.x + segmentDistance;
                segY = config.y;
                keyX = config.x + keyDistance;
                keyY = config.y;
            } else if (index === 2) { // SHIELD - Bottom (S)
                segX = config.x;
                segY = config.y + segmentDistance;
                keyX = config.x;
                keyY = config.y + keyDistance;
            } else { // ATTACK - Left (A)
                segX = config.x - segmentDistance;
                segY = config.y;
                keyX = config.x - keyDistance;
                keyY = config.y;
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