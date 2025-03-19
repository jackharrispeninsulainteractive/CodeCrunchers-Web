class HighScoresState extends State{

    _backButton;

    constructor() {
        super();

        let backButton  = new Button()
            .setText("Continue")
            .setX(App.getCanvas().width/2-(App.getTileSize()*App.getScale())*3)
            .setY(window.innerHeight-128)
            .setWidth(6)
            .setTextXOffset(48);

        backButton.setOnClick(function () {
            App.setState("menuState");
        });

        this._backButton =backButton;

    }

    render(ctx) {
        App.getState("menuState").drawBackground(ctx);
        ctx.fillStyle = "white";

        let priorFont = ctx.font;
        ctx.font = "64px Minecraft";

        let textWidth = ctx.measureText("High Scores (Top 10)").width;
        ctx.fillText("High Scores (Top 10)", App.getCanvas().width/2-(textWidth/2), 128);

        ctx.font = priorFont;

        // Safely get stored scores
        let priorData = localStorage.getItem("scores");
        let scores = null;

        // Check if we have any data
        if (priorData) {
            try {
                scores = JSON.parse(priorData);
            } catch (e) {
                console.error("Error parsing scores:", e);
            }
        }

        // If we have valid scores data with results
        if (scores && scores.results && scores.results.length > 0) {
            let y = 128+64;
            let index = 0;
            let max = Math.min(10, scores.results.length);

            while(index < max) {
                let text = scores.results[index].score + " on " + scores.results[index].data;
                let textWidth = ctx.measureText(text).width;
                ctx.fillText(text, App.getCanvas().width / 2 - (textWidth / 2), y + (32 * index));
                index++;
            }
        } else {
            // Display a message when no scores are available
            ctx.font = "32px Minecraft";
            let noScoresText = "No scores yet. Play the game to set a score!";
            let noScoresWidth = ctx.measureText(noScoresText).width;
            ctx.fillText(noScoresText, App.getCanvas().width / 2 - (noScoresWidth / 2), 128+64+32);
            ctx.font = priorFont;
        }

        this._backButton.render(ctx);
    }
    update(){

        this._backButton.update();


    }

}