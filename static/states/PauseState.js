class PauseState extends State{

    _settingsButton;
    _resumeGameButton;
    _quitButton;


    constructor() {
        super();

        this._resumeGameButton = new Button()
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setText("Resume Game")
            .setY(256+64)
            .setWidth(6)
            .setTextXOffset(36)

        this._resumeGameButton.setOnClick(function () {
            App.setState("gameState")
        })

        this._settingsButton = new Button()
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setText("Settings")
            .setY(256+128+32)
            .setWidth(6)
            .setTextXOffset(64);

        this._settingsButton.setOnClick(function () {
            App.setState("settingsState","pauseState");
        });

        this._quitButton = new Button()
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setText("Quit Game")
            .setY(512)
            .setWidth(6)
            .setTextXOffset(54);

        this._quitButton.setOnClick(function () {
            App.getState("gameState").endGame();
        })

    }

    render(ctx){

        App.getState("gameState").render(ctx);

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,0,App.getCanvas().width,App.getCanvas().height);

        this._settingsButton.render(ctx);
        this._resumeGameButton.render(ctx);
        this._quitButton.render(ctx);
    }

    update(){
        if(App.getKeyPress("Escape")){
            App.unPressKey("Escape");
            App.setState("gameState");
        }

        this._settingsButton.update();
        this._resumeGameButton.update();
        this._quitButton.update();

    }
}