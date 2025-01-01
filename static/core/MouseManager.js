class MouseManager {

    _pos = {x: 0,y:0,absoluteX: 0,absoluteY: 0}
    _buttons = {left: false, right: false};

    constructor(canvas) {
        canvas.addEventListener("mousedown",(event)=>this._mouseDown(event));
        canvas.addEventListener("mouseup",(event)=>this._mouseUp(event));
        canvas.addEventListener("contextmenu",(event)=>this._mouseUp(event));

        canvas.addEventListener("mousemove",(event)=>this.onMove(event));
    }

    _mouseDown(event){
        if(event.button === 0){
            this._buttons.left = true;
        }

        if(event.button === 2){
            this._buttons.right = true;
        }
    }
    _mouseUp(event){
        event.preventDefault();

        if(event.type !== "contextmenu"){

            if(event.button === 0){
                this._buttons.left = false;
            }

            if(event.button === 2){
                this._buttons.right = false;
            }
        }
    }

    onMove(event){
        this._pos.absoluteX = event.pageX;
        this._pos.absoluteY = event.pageY;

        this._pos.x = event.pageX+App.getCameraOffsets().x;
        this._pos.y = event.pageY+App.getCameraOffsets().y;

    }

    getMousePosition(){
        return this._pos;
    }

    getMousePressed(button){
        return this._buttons[button];
    }

}