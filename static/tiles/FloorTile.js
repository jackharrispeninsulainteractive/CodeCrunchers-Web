class FloorTile extends Tile{


    constructor() {
        super(17);
        this._solid = true;
    }

    render(x,y,ctx){

        if(!(App.getTileAtLocation(x,y-1) instanceof FloorTile)){
            Kernel.instance._spriteSheet.drawImage(this._textureId,x*(App.getTileSize()*App.getScale()),y*(App.getTileSize()*App.getScale()),ctx,false);
        }else{
            Kernel.instance._spriteSheet.drawImage(16,x*(App.getTileSize()*App.getScale()),y*(App.getTileSize()*App.getScale()),ctx,false);
        }

    }

}