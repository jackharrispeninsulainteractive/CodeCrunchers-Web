class GameOverState extends State{

    _score;
    _tryAgainButton;
    _backToMenuButton;

    constructor() {
        super();


        this._tryAgainButton  = new Button()
            .setText("Try Again?")
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3-(App.getTileSize()*App.getScale())*3.5)
            .setY(448)
            .setWidth(6)
            .setTextXOffset(48);

        this._tryAgainButton.setOnClick(function () {
            App.saveScore(App.getState("gameOverState")._score);
            App.getState("gameState").startGame();
        });

        this._backToMenuButton  = new Button()
            .setText("Main Menu")
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3+(App.getTileSize()*App.getScale())*3.5)
            .setY(448)
            .setWidth(6)
            .setTextXOffset(48);

        this._backToMenuButton.setOnClick(function () {
            App.saveScore(App.getState("gameOverState")._score);
            App.setState("menuState");
        });
    }

    saveScore(score) {
        // First, check if score is defined
        if (score === undefined || score === null) {
            score = 0; // Provide a default value
        }

        let priorData = localStorage.getItem("scores");
        if (priorData === null) {
            localStorage.setItem("scores", JSON.stringify({results: []}));
        }

        priorData = JSON.parse(localStorage.getItem("scores"));
        let date = new Date();

        // Convert score to string safely
        let attempt = {
            data: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
            score: String(score) // Using String() is safer than toString() for potentially null values
        };

        priorData.results.unshift(attempt);
        localStorage.setItem("scores", JSON.stringify(priorData));
    }

    setScore(score){
        this._score = score;
    }

    render(ctx){
        App.getState("menuState").drawBackground(ctx);
        ctx.fillStyle = "white";

        let priorFont = ctx.font;
        ctx.font = "64px Minecraft";

        let textWidth = ctx.measureText("Game Over!").width;

        ctx.fillText("Game Over!",App.getCanvas().width/2-(textWidth/2),256);

        ctx.font = "32px Minecraft";
        textWidth = ctx.measureText("Score : "+this._score).width;
        ctx.fillText("Score : "+this._score,App.getCanvas().width/2-(textWidth/2),384);

        ctx.font = priorFont;

        this._tryAgainButton.render(ctx);
        this._backToMenuButton.render(ctx);
    }

    update(){
        this._tryAgainButton.update();
        this._backToMenuButton.update();
    }

}