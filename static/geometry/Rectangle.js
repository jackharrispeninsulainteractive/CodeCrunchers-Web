class Rectangle{

    _bounds = {x: 0,y:0,width: 0,height:0};

    constructor(x,y,width,height) {
        this._bounds.x = x;
        this._bounds.y = y;
        this._bounds.width = width;
        this._bounds.height = height;
    }

    contains(x,y){
        return x > this._bounds.x && x < (this._bounds.x + this._bounds.width) && y > this._bounds.y && y < this._bounds.y + this._bounds.height;
    }

    getBounds(){
        return this._bounds;
    }

    intersects(shape){

        //Get the 4 points from the shape
        let points = [
            {x: shape.getX(), y: shape.getY()},
            {x: shape.getX()+shape.getWidth(), y: shape.getY()+shape.getHeight()},
            {x: shape.getX()+shape.getWidth(), y: shape.getY()},
            {x: shape.getX(), y: shape.getY()+shape.getHeight()}];

        let outcome = false;
        points.forEach((point)=>{
            let check = this.contains(point.x,point.y);
            if(check){
                outcome = true;
            }
        });

        return outcome;
    }

    setX(x){
        this._bounds.x = x;
    }

    getX(){
        return this._bounds.x;
    }

    setY(y){
        this._bounds.y = y;
    }

    getY(){
        return this._bounds.y;
    }

    setWidth(width){
        this._bounds.width = width;
    }

    getWidth(){
        return this._bounds.width;
    }

    setHeight(height){
        this._bounds.height = height;
    }

    getHeight(){
        return this._bounds.height;
    }



}