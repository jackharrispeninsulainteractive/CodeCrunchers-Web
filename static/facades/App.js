class App {

    static getTileAtLocation(x, y){
        return Kernel.instance._levelGenerator.getTileAtLocation(x,y);
    }

    static getCameraOffsets(){
        return {x: Kernel.instance._camera.getXOffset(), y: Kernel.instance._camera.getYOffset()};
    }


    static addEntity(entity){
        let id = SnapLoad.generateUuid();
        entity.setId(id);
        App.getState("gameState")._entities.set(id,entity);
    }

    static deleteEntity(id){
        App.getState("gameState")._entities.delete(id);
    }

    static getRandomInt(min,max){
        return Kernel.instance._getRandomInt(min,max);
    }

    static drawSprite(x,y,id,absolute,dx,dy){
        Kernel.instance._spriteSheet.drawImage(id,x,y,Kernel.instance._context,absolute,dx,dy);
    }

    static drawRect(x,y,color){
        Kernel.instance._context.fillStyle = color;
        Kernel.instance._context.fillRect(x+App.getCameraOffsets().x,y+App.getCameraOffsets().y+Kernel.instance._mapPixelOffset,32,32);
    }


    static getResource(name){
        return Kernel.instance._resources.get(name);
    }

    static getMousePosition(){
        return Kernel.instance._mouseManager.getMousePosition();
    }

    static getCanvas(){
        return Kernel.instance._canvas;
    }

    static checkMousePressed(button){
        return Kernel.instance._mouseManager.getMousePressed(button);
    }

    static resetMouseButtonPress(button){
        Kernel.instance._mouseManager._buttons[button] = false;
    }

    static getCamera(){
        return Kernel.instance._camera;
    }

    static getLevelGenerator(){
        return Kernel.instance._levelGenerator;
    }

    static setState(state,returnState){
        Kernel.instance._returnState = returnState;

        Kernel.instance.setState(state);
    }

    static getState(state){

        return Kernel.instance._states.get(state);
    }

    static returnToPriorState(){
        Kernel.instance._activeState = App.getState(Kernel.instance._returnState);
    }

    static getTileById(id){
        return Kernel.instance._tiles[id];
    }

    static getSettings(){
        return Kernel.instance._settings;
    }

    static getStatistics(){
        return Kernel.instance._statistics;
    }

    static getKeyPress(key){
        return Kernel.instance._keyboardManager.keyPressed(key);
    }

    static unPressKey(key){
        Kernel.instance.getKeyboardManager().unPress(key)
    }

    static getScale(){
        return Kernel.instance._scale;
    }

    static getTileSize(){
        return Kernel.instance._tileSize;
    }

    static showDebug(){
        return Kernel.instance._states.get("gameState")._player._showDebug;
    }

    static saveScore(score){
        Kernel.instance._states.get("gameOverState").saveScore(score);
    }

}