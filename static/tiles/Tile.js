class Tile {

    _solid = false;
    _textureId = 0;

    constructor(textureId) {
        this._textureId = textureId;
    }

    isSolid(){
        return this._solid;
    }

    render(x,y,ctx){
        //ABSTRACT METHOD
    }

}