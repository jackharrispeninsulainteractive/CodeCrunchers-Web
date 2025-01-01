class GameCompletedState extends State{

    _continueButton;
    _score;

    constructor() {
        super();

        this._continueButton  = new Button()
            .setText("Continue")
            .setX(App.getCanvas().width/2-(App.getTileSize()*App.getScale())*3)
            .setY(App.getCanvas().height-(64+16))
            .setWidth(6)
            .setTextXOffset(48);

        this._continueButton.setOnClick(this._continueButtonClick);

    }

    setScore(score){
        this._score = score;
    }

    _continueButtonClick(){
        App.saveScore(this._score);
        App.setState("menuState");
    }

    render(ctx){

        App.getState("menuState").drawBackground(ctx);

        ctx.fillStyle = "white";
        ctx.fillRect(128,128,App.getCanvas().width-256,App.getCanvas().height*0.75);

        ctx.beginPath();
        ctx.lineWidth = "16";
        ctx.strokeStyle = "#ffc500";
        ctx.rect(128, 128, App.getCanvas().width-256,App.getCanvas().height*0.75);
        ctx.stroke();

        ctx.fillStyle = "black";

        let priorFont = ctx.font;
        ctx.font = "64px Minecraft";

        let textWidth = ctx.measureText("{Certificate of Graduation}").width;

        ctx.fillText("{Certificate of Graduation}",App.getCanvas().width/2-(textWidth/2),256);

        ctx.font = "32px Minecraft";
        textWidth = ctx.measureText("Congratulations!").width;
        ctx.fillText("Congratulations",App.getCanvas().width/2-(textWidth/2),384);
        ctx.font = "64px Minecraft";

        textWidth = ctx.measureText("Score: "+this._score).width;
        ctx.fillText("Score: "+this._score,App.getCanvas().width/2-(textWidth/2),621);
        ctx.font =  priorFont;


        ctx.drawImage(App.getResource("fileReader.image('/static/res/CodeCrunchers-Logo.png')"),App.getCanvas().width/2-(1280/2),App.getCanvas().height-(256+64+32));

        this._continueButton.render(ctx);

    }

    update(){

        this._continueButton.update();

    }

}