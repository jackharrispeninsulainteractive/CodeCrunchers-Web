class KeyboardManager {

    _keyCodes;

    constructor() {

        this._keyCodes = new Map();

        window.addEventListener("keydown", this._keyPressed)
        
        window.addEventListener("keyup",this._keyReleased)

    }

    keyPressed(key){
        return this._keyCodes.has(key);
    }

    unPress(key){
        Kernel.instance._keyboardManager._keyCodes.delete(key);
    }

    _keyPressed(keyboardEvent){

        if(keyboardEvent.code === "Space"){
            Kernel.instance._keyboardManager._keyCodes.set("space",true);
        }else{
            Kernel.instance._keyboardManager._keyCodes.set(keyboardEvent.key,true);
        }
    }

    _keyReleased(keyboardEvent){
        if(keyboardEvent.code === "Space"){
            Kernel.instance._keyboardManager._keyCodes.delete("space");
        }else{
            Kernel.instance._keyboardManager._keyCodes.delete(keyboardEvent.key);
        }
    }






}