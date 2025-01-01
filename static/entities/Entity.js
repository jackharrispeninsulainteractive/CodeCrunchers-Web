class Entity {

    _x
    _y;
    _width;
    _height;
    _id;

    _alive = true;
    _textureId;
    _health = 100;

    constructor(x,y, textureId) {
        this._x = x;
        this._y = y;
        this._textureId = textureId;
    }

    update(){
        //ABSTRACT METHOD
    }

    render(ctx){
        //ABSTRACT METHOD
    }

    isAlive(){
        return this._alive;
    }

    getX(){
        return this._x;
    }

    getY(){
        return this._y;
    }

    setId(id){
        this._id = id;
    }


}