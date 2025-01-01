class SpriteSheet {

    _image;
    _templateSize;
    _indexes = [];


    constructor(image,templateSize) {

        this._image = image;
        this._templateSize = templateSize;

        let x =0;
        let y = 0;
        let tile = 0;
        while(y < image.height) {

            while (x < image.width) {
                this._indexes[tile] = {x: x,y: y};
                x+=this._templateSize;
                tile++;
            }
            x= 0;

            y+=this._templateSize;
        }
    }

    drawImage(index,x,y,ctx,absolute,dx = 1,dy = 1){
        ctx.imageSmoothingEnabled = false;

        if(absolute){
            ctx.drawImage(this._image, this._indexes[index].x, this._indexes[index].y, 32, 32, x, y, (App.getTileSize()*App.getScale())*dx, App.getTileSize()*App.getScale()*dy)
        }else{
            ctx.drawImage(this._image, this._indexes[index].x, this._indexes[index].y, 32, 32, x-App.getCameraOffsets().x, y-App.getCameraOffsets().y, App.getTileSize()*App.getScale(), App.getTileSize()*App.getScale())
        }
    }


    getIndexes(){
        return this._indexes;
    }

    drawPreview(ctx){
        ctx.fillStyle = "white";

        let windowWidth = 512;
        let windowHeight = 512;
        let relativeX =  Kernel.instance._canvas.width/2- windowWidth/2
        let relativeY = Kernel.instance._canvas.height/2- windowHeight/2;
        let maxPerRow = windowWidth/this._templateSize;
        let currentRowCount = 0;
        let currentRow= 0;

        ctx.fillRect(relativeX,relativeY,windowWidth,windowHeight);

        let index = 0;
        this._indexes.forEach((sprite)=>{

            ctx.drawImage(this._image, sprite.x, sprite.y, 32, 32, relativeX+(32*currentRowCount), relativeY+(32*currentRow), 32, 32)
            ctx.fillStyle = "black";
            ctx.font = "8px Minecraft";
            ctx.fillText(index,relativeX+(32*currentRowCount),relativeY+(32*currentRow)+8);

            currentRowCount++;
            index++;

            if(currentRowCount > maxPerRow-1){
                currentRowCount = 0;
                currentRow++;
            }
        })
    }



}