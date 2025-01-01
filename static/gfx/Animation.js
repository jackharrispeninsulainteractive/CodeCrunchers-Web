class Animation {

    _imageIdRange;
    _duration;
    _currentImage = 0;
    _lastTime = 0;

    constructor(imageIdRange,duration) {
        this._imageIdRange = imageIdRange;
        this._duration = duration;
    }

    render(ctx,x,y){

        let now = Date.now();
        let elapsed = now - this._lastTime;

        if (elapsed > this._duration) {

            if (this._currentImage < this._imageIdRange.length - 1) {
                this._currentImage++;
            } else {
                this._currentImage = 0;
            }
        }

        Kernel.instance._spriteSheet.drawImage(this._imageIdRange[this._currentImage], x, y, ctx, false);

        this._lastTime = now - elapsed % this._duration;


    }

}