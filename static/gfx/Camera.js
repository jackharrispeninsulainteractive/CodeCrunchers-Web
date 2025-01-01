class Camera {

    _followingEntity;
    _yCenter = Math.round((App.getCanvas().height/2)-(5*32))

    centerOnEntity(entity){
        this._followingEntity = entity;

    }

    getXOffset(){
        // x - canvas size + 50% of the object size, 16 in this case.
        if(this._followingEntity === undefined){
            return 0;
        }else {
            return this._followingEntity.getX()*App.getScale() - (Kernel.instance._canvas.width / 2);
        }
    }

    getYOffset(){

        return 0;

    }


}