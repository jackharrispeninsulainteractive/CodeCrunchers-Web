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

    render(ctx){
        App.getState("menuState").drawBackground(ctx);
        ctx.fillStyle = "white";

        let priorFont = ctx.font;
        ctx.font = "64px Minecraft";

        let textWidth = ctx.measureText("High Scores (Top 10)").width;

        ctx.fillText("High Scores (Top 10)",App.getCanvas().width/2-(textWidth/2),128);

        ctx.font = priorFont;

        let priorData = JSON.parse(localStorage.getItem("scores"));
        let text = "";
        let y = 128+64;
        let index = 0;
        let max = 10;
        if(priorData.results.length < 10){
            max = priorData.results.length;
        }

        while(index < max){
            text = priorData.results[index].score + " on " + priorData.results[index].data;
            textWidth = ctx.measureText(text).width;
            ctx.fillText(text, App.getCanvas().width / 2 - (textWidth / 2), y + (32 * index));
            index++;
        }

        this._backButton.render(ctx);


    }

    update(){

        this._backButton.update();


    }

}