class SpawnerTile extends Tile{
    constructor() {
        super(25);
    }

    render(x,y,ctx){
        //Instead of drawing the tile sprite we will simply render the above tile at that location.
        if(App.showDebug()){
            Kernel.instance._spriteSheet.drawImage(this._textureId,x*(App.getTileSize()*App.getScale()),y*(App.getTileSize()*App.getScale()),ctx,false);
        }else {
            App.getTileAtLocation(x, y - 1).render(x, y, ctx);
        }
    }


}