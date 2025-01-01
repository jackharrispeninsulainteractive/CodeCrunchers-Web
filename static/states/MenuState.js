class MenuState extends State{

    _interfaceObjects = [];

    constructor() {
        super();

        let playButton  = new Button()
            .setText("Start Game")
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setY(256+64)
            .setWidth(6)
            .setTextXOffset(48);

        playButton.setOnClick(this._play);

        let creditsButton = new Button()
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setText("Credits")
            .setY(256+128+32)
            .setWidth(6)
            .setTextXOffset(64);

        creditsButton.setOnClick(this._credits);

        let highScoresButton = new Button()
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setText("High Scores")
            .setY(512)
            .setWidth(6)
            .setTextXOffset(64);

        highScoresButton.setOnClick(this._highScores);

        let settingsButton = new Button()
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setText("Settings")
            .setY(512+96)
            .setWidth(6)
            .setTextXOffset(64);

        settingsButton.setOnClick(this._settings);

        this._interfaceObjects.push(playButton);
        this._interfaceObjects.push(creditsButton);
        this._interfaceObjects.push(settingsButton);
        this._interfaceObjects.push(highScoresButton)

    }

    _play(){
        App.getState("gameState").startGame();
    }

    _credits(){
        window.open("https://github.com/OUA-SP3-Group03/CodeCrunchers-Game");
    }

    _settings(){
        App.setState("settingsState","menuState");
    }

    _highScores(){
        App.setState("highScoreState");
    }

    drawBackground(ctx){
        let grad=ctx.createLinearGradient(0,0, App.getCanvas().width/2,App.getCanvas().height/2);
        grad.addColorStop(0, "#5a438d");
        grad.addColorStop(1, "#22123b");
        ctx.fillStyle = grad;

        ctx.fillRect(0,0,App.getCanvas().width,App.getCanvas().height);
    }

    render(ctx){
        this.drawBackground(ctx);

        ctx.drawImage(App.getResource("fileReader.image('/static/res/CodeCrunchers-Logo.png')"),App.getCanvas().width/2-(1280/2),64);
       //App.drawSprite(App.getCanvas().width-64*9,App.getCanvas().height-64*9,27,true,8,8)

        this._interfaceObjects.forEach((object)=>{
            object.render(ctx);
        })

        let width = ctx.measureText("Web Port Created By Jack Harris based on Code Crunchers ('https://github.com/OUA-SP3-Group03/CodeCrunchers-Game')").width;
        ctx.fillStyle = "white"
        ctx.fillText("Created by Jack Harris based on Code Crunchers (https://github.com/OUA-SP3-Group03/CodeCrunchers-Game)",App.getCanvas().width/2-width/2,App.getCanvas().height-32)
    }

    update(){
        App.getCamera()._followingEntity = undefined;

        this._interfaceObjects.forEach((object)=>{
            object.update();
        })
    }


}