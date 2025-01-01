class Spawner extends Entity{


    constructor(x,y) {
        super(x,y,9);

        let choice = App.getRandomInt(0,1);

        if(choice === 0){
            App.addEntity(new Enemy(x,y));
            //App.addEntity(new PowerUp(x,y));
        }else{
            App.addEntity(new PowerUp(x,y));
        }

    }

}