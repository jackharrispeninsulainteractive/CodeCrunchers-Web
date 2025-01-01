class SettingsState extends State{

    _interfaceObjects = [];
    _centerX = window.innerWidth/2;

    constructor() {
        super();

        let musicUp  = new Button()
            .setText(">")
            .setX(this._centerX-(64*5)+128+16)
            .setY(352+32)
            .setWidth(2)
            .setTextXOffset(30);

        musicUp.setOnClick(this.adjustMusicUp);

        let musicDown  = new Button()
            .setText("<")
            .setX(this._centerX-(64*5))
            .setY(352+32)
            .setWidth(2)
            .setTextXOffset(30);


        musicDown.setOnClick(this.adjustMusicDown);

        let soundUp = new Button()
            .setText(">")
            .setX(this._centerX-(64*5)+128+16)
            .setY(496+128)
            .setWidth(2)
            .setTextXOffset(30);

        soundUp.setOnClick(this.adjustSoundUp);

        let soundDown = new Button()
            .setText("<")
            .setX(this._centerX-(64*5))
            .setY(496+128)
            .setWidth(2)
            .setTextXOffset(30);

        soundDown.setOnClick(this.adjustSoundDown);

        let saveButton = new Button()
            .setText("Save & return")
            .setX(window.innerWidth/2-(App.getTileSize()*App.getScale())*3)
            .setY(window.innerHeight-128)
            .setWidth(6)
            .setTextXOffset(40);

        saveButton.setOnClick(this.saveButtonPress);

        this._interfaceObjects.push(saveButton)

        this._interfaceObjects.push(musicUp);
        this._interfaceObjects.push(musicDown);
        this._interfaceObjects.push(soundUp);
        this._interfaceObjects.push(soundDown);

    }

    saveButtonPress(){
        let musicVolumeCookie = new Cookie("ccMusicVolume",App.getSettings().musicVolume);
        let effectsVolumeCookie = new Cookie("ccEffectsVolume",App.getSettings().effectsVolume);

        effectsVolumeCookie.save();
        musicVolumeCookie.save();

        App.returnToPriorState();
    }

    adjustMusicUp(){
        if(App.getSettings().musicVolume < 100) {
            App.getSettings().musicVolume += 10;
        }
    }

    adjustMusicDown(){
        if(App.getSettings().musicVolume > 10) {
            App.getSettings().musicVolume -= 10;
        }
    }

    adjustSoundDown(){
        if(App.getSettings().effectsVolume > 10) {
            App.getSettings().effectsVolume -= 10;
        }
    }

    adjustSoundUp(){
        if(App.getSettings().effectsVolume < 100) {
            App.getSettings().effectsVolume += 10;
        }
    }


    render(ctx){

        if(Kernel.instance._returnState === "pauseState"){
            App.getCamera()._followingEntity = App.getState("gameState")._player;
            App.getState("gameState").render(ctx);

            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0,0,App.getCanvas().width,App.getCanvas().height);

        }else {
            App.getState("menuState").drawBackground(ctx);
        }


        //MUSIC VOLUME
        ctx.fillStyle = "white"
        ctx.fillText("Music Volume",this._centerX-(App.getTileSize()*App.getScale()*5),256);

        let intervals = 10;
        let currentVolume = App.getSettings().musicVolume/10;

        let i = 0;
        while(i < intervals){

            if(i < currentVolume){
                App.drawSprite(this._centerX+(i*App.getTileSize()*App.getScale())-((App.getTileSize()*App.getScale())*5),256+32,7,true);
            }else{
                App.drawSprite(this._centerX+(i*App.getTileSize()*App.getScale())-((App.getTileSize()*App.getScale())*5),256+32,4,true);
            }

            i++;
        }

        //EFFECTS VOLUME
        ctx.fillStyle = "white"
        ctx.fillText("Sfx Volume",this._centerX-(App.getTileSize()*App.getScale()*5),496);

        intervals = 10;
        currentVolume = App.getSettings().effectsVolume/10;

        i = 0;
        while(i < intervals){

            if(i < currentVolume){
                App.drawSprite(this._centerX+(i*App.getTileSize()*App.getScale())-((App.getTileSize()*App.getScale())*5),496+32,7,true);
            }else{
                App.drawSprite(this._centerX+(i*App.getTileSize()*App.getScale())-((App.getTileSize()*App.getScale())*5),496+32,4,true);
            }

            i++;
        }

        this._interfaceObjects.forEach((object)=>{
            object.render(ctx);
        })
    }

    update(){

        if(App.getKeyPress("Escape") && Kernel.instance._returnState === "pauseState"){
            App.unPressKey("Escape");
            App.setState("pauseState");
        }

        this._interfaceObjects.forEach((object)=>{

            object.update();
        })

    }



}