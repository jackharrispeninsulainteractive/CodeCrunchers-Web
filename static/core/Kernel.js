class Kernel {

    _canvas;
    _context;
    _width;
    _height;
    _tiles;
    _spriteSheet;
    _levelGenerator;
    _statistics = {lastTime: 0, Fps: 0, tps:0, lastFrame: 0};
    _entities = new Map();
    _keyboardManager;
    _mouseManager;
    _mapPixelOffset = 96;
    _showTileSetHelp = false;
    _camera;
    _resources;
    _states = new Map();
    _activeState;
    _settings = {musicVolume: 100,effectsVolume: 100}
    _returnState;
    _loop = {then: 0,now:0,count: 0}
    _scale = 2;
    _tileSize = 32;

    _timestep = 1000 / 60; // 60 updates per second
    _lastUpdateTime = 0;
    _accumulator = 0;

    static instance;

    constructor(canvas) {
        Kernel.instance = this;
        this._keyboardManager = new KeyboardManager();
        this._lastUpdateTime = performance.now();

        this._canvas = document.getElementById(canvas);
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._mouseManager = new MouseManager(this._canvas);

        this._context = this._canvas.getContext("2d");
        this._context.webkitImageSmoothingEnabled = false;
        this._context.mozImageSmoothingEnabled = false;
        this._context.imageSmoothingEnabled = false;
        this._context.font = "32px Minecraft";

        this._canvas.width = this._width;
        this._canvas.height = this._height;

        document.addEventListener("resize", (event)=>{
            this._width = window.innerWidth;
            this._height = window.innerHeight;

            this._canvas.width = this._width;
            this._canvas.height = this._height;
        })

        this._tiles = [
            new AirTile(),
            new FloorTile(),
            new InteriorTile(),
            new InteriorDoorTile(),
            null,
            null,
            null,
            null,
            null,
            new SpawnerTile(),
        ];

        this._camera = new Camera();

        let menuState = new MenuState();
        this._activeState = menuState;


        this._states.set("menuState",menuState);
        this._states.set("gameState", new GameState());
        this._states.set("settingsState", new SettingsState());
        this._states.set("pauseState",new PauseState());
        this._states.set("gameOverState", new GameOverState());
        this._states.set("gameCompletedState", new GameCompletedState());
        this._states.set("highScoreState", new HighScoresState());

        let musicVolumeCookie = Cookie.get("ccMusicVolume");
        let effectsVolumeCookie = Cookie.get("ccEffectsVolume");

        if(musicVolumeCookie !== null){
            this._settings.musicVolume = Number(musicVolumeCookie.getValue());
        }

        if(effectsVolumeCookie !== null){
            this._settings.effectsVolume = Number(effectsVolumeCookie.getValue());
        }

    }

    setResources(res){
        this._resources = res;
    }

    getKeyboardManager(){
        return this._keyboardManager;
    }

    setWorld(worldFile){

        this._levelGenerator = new LevelGenerator(worldFile,8);
        this._levelGenerator.generateWorld();
        this._levelGenerator._analyseMap();

    }

    setSpriteSheet(image,templateSize){
        this._spriteSheet = new SpriteSheet(image,templateSize);
    }

    setState(state){
        this._activeState = this._states.get(state);
    }

    start(){
        this.gameLoop()
    }

    render(){

        this._context.font = "16px Minecraft";

        this._activeState.render(this._context);

        if(this._showTileSetHelp){
            this._spriteSheet.drawPreview(this._context,128,128)
        }

    }

    update(){

        if(this._keyboardManager.keyPressed("F4")){
            this._showTileSetHelp = !this._showTileSetHelp;
            this._keyboardManager.unPress("F4")
        }

        this._activeState.update();

    }

    gameLoop(timeStamp){
        let instance = Kernel.instance;

        // Calculate time since last frame
        const currentTime = performance.now();
        const deltaTime = currentTime - instance._lastUpdateTime;
        instance._lastUpdateTime = currentTime;

        // Add to accumulator
        instance._accumulator += deltaTime;

        // Update game logic at fixed timestep
        while (instance._accumulator >= instance._timestep) {
            instance.update();
            instance._accumulator -= instance._timestep;
        }

        // Calculate FPS
        let timePassed = (timeStamp - instance._statistics.lastTime) / 1000;
        instance._statistics.Fps = Math.round(1 / timePassed);

        // Render as fast as possible
        instance.render();

        instance._statistics.lastTime = timeStamp;
        window.requestAnimationFrame(instance.gameLoop);

    }

    oldGameLoop(timeStamp){
        let instance = Kernel.instance;

        let timePassed = (timeStamp - instance._statistics.lastTime) / 1000;

        instance._statistics.Fps = Math.round(1 / timePassed);

        instance.update();
        instance.render();

        instance._statistics.lastTime = timeStamp;
        window.requestAnimationFrame(Kernel.instance.gameLoop);

    }

    _getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }

}