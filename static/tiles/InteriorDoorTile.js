class InteriorDoorTile extends Tile{

    constructor() {
        super(19);
    }

    render(x,y,ctx){
        Kernel.instance._spriteSheet.drawImage(this._textureId,x*(App.getTileSize()*App.getScale()),y*(App.getTileSize()*App.getScale()),ctx,false);
    }

}