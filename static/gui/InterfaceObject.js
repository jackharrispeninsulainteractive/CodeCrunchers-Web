class InterfaceObject {

    _x;
    _y;
    _width = 0;
    _height = 0;
    _text = "New Button";
    _rect = new Rectangle(0,0,0,App.getTileSize()*App.getScale());
    _hovering = false;
    _textXOffset = 0;


    setX(x){
        this._x = x;
        this._rect.setX(x);
        return this;
    }

    setY(y){
        this._y = y;
        this._rect.setY(y);
        return this;
    }

    setText(text)
    {
        this._text = text;
        return this;
    }

    setTextXOffset(offset){
        this._textXOffset = offset;
        return this;
    }

    setWidth(width){
        this._width = width;
        this._rect.setWidth(width*(App.getTileSize()*App.getScale()));
        return this;
    }


    render(ctx){
        //Abstract
    }

    update(){
        let pos = App.getMousePosition();
        this._hovering = this._rect.contains(pos.absoluteX, pos.absoluteY);
    }
}