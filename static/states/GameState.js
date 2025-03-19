class GameState extends State{


    _player;
    _backgroundTrack;
    _timer;
    _music;
    _enemiesKilled;
    _bonus;
    _score;
    _entities = new Map();
    _map = {tiles: [],width:0,height:0};
    _seconds = 0;

    constructor() {
        super();

        this._music = ["Music1.wav","Music2.wav","Music3.wav","Music4.wav"];

        this._bonus = 100;
    }

    startGame(){
        this._entities.clear();

        this._player = new Player(64,64);
        App.addEntity(this._player);

        App.getCamera().centerOnEntity(this._player);

        App.getLevelGenerator();
        App.getLevelGenerator().generateWorld();
        App.getLevelGenerator()._analyseMap();

        this._map.tiles = App.getLevelGenerator().getWorld();
        this._map.width = App.getLevelGenerator().getWorldWidth();
        this._map.height = App.getLevelGenerator().getWorldHeight();

        let music = this._music[App.getRandomInt(0,3)];

        this._backgroundTrack = App.getResource(music);
        this._backgroundTrack.volume = App.getSettings().musicVolume/100;
        this._backgroundTrack.play();
        this._backgroundTrack.loop = true;

        this._score = 0;
        this._seconds = 0;

        App.setState("gameState");
    }

    endGame(){
        this._backgroundTrack.pause();
        App.getState("gameOverState").setScore(this._score);
        App.setState("gameOverState");
    }


    drawMap(ctx){

        ctx.fillStyle = "#22123b";
        ctx.fillRect(0,0,App.getCanvas().width,App.getCanvas().height);


        let x =0;
        let y = 0;
        let tile = 0;
        while(y < this._map.height) {

            while (x < this._map.width) {
                //this._spriteSheet.drawImage(16,x*32,y*32,this._context,this._scale)
                App.getTileById(this._map.tiles[tile]).render(x, y, ctx);
                x++;
                tile++;
            }
            x= 0;

            y++;
        }
    }

    addScore(amount){
        this._score += amount;
    }

    render(ctx) {
        this.drawMap(ctx)

        this._entities.forEach((entity)=>{
            entity.render(ctx);
        });

        let priorFont = ctx.font;
        ctx.font = "64px Minecraft";
        ctx.fillStyle = "white";

        if(!App.showDebug()) {
            ctx.fillText("Time : " + (this._seconds / 100), 128, 128);
        }

        ctx.font = priorFont;
    }

    update(){

        this._seconds++;

        this._entities.forEach((entity)=>{
            entity.update();
        })

        if(App.getKeyPress("Escape")){
            App.unPressKey("Escape");
            App.setState("pauseState");
        }

        if(this._player._x > 5300){
            this._backgroundTrack.pause();
            App.getState("gameCompletedState").setScore(this._score);
            App.setState("gameCompletedState");
        }

    }


}