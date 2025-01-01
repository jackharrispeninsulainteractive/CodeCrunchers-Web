class LevelGenerator {

    //world variables
    _worldWidth;
    _worldHeight;
    _worldTiles = [];

    //room variables
    _roomWidth;
    _roomHeight;
    _rooms = [];
    _maxRooms;
    _roomCount = 0;

    constructor(worldFile, maxRooms) {

        this._maxRooms = maxRooms;
        this.loadWorldRooms(worldFile);
        this.generateWorld();

    }


    loadWorldRooms(worldFile){

        let lines = worldFile.split("\n");

        let currentRoom = 0;
        let room = "";

        lines.forEach((line)=>{
            if(!line.startsWith("//")){

                if(line.startsWith("{{room_width}}")){
                    this._roomWidth = line.split("=")[1].trim();
                }else if(line.startsWith("{{room_height}}")){
                    this._roomHeight = line.split("=")[1].trim();
                }else if(line.startsWith("{{room_count}}")){
                    this._roomCount = line.split("=")[1].trim();
                }else if(line.startsWith("{{new_room}}")){
                    this._rooms[currentRoom] =  room;
                    room  = "";
                    currentRoom++;
                }else{
                    room += line;
                }
            }
        });

    }

    generateWorld(){
        let world = [];

        let worldRooms = [];
        let  i = 0;
        while(i < this._maxRooms){
            worldRooms[i] = App.getRandomInt(0,this._rooms.length-1);

            i++;
        }

        let x = 0;
        let y = 0;
        let currentRoom = 0;

        let tile = 0;
        let roomTile = 0;

        while(y < this._roomHeight){

            while(currentRoom < worldRooms.length){

                while(x < this._roomWidth){
                    let offset = y*this._roomWidth;
                    world[tile] = this._rooms[worldRooms[currentRoom]][x+offset]

                    x++;
                    tile++;
                }

                roomTile = 0;
                currentRoom++;
                x= 0;
            }

            currentRoom = 0;
            y++;
        }

        this._worldWidth = this._roomWidth*this._maxRooms;
        this._worldHeight= this._roomHeight;
        this._worldTiles = world;

    }

    getTileAtLocation(targetX,targetY){
        let x =0;
        let y = 0;
        let tile = 0;
        let selectedTile;

        while(y < this._worldHeight) {

            while (x < this._worldWidth) {

                if(targetX === x && targetY === y) {
                    selectedTile = Kernel.instance._tiles[this._worldTiles[tile]];
                    break;
                }
                x++;
                tile++;
            }
            x= 0;

            y++;
        }

        if(selectedTile === undefined){
            selectedTile = Kernel.instance._tiles[0];
        }

        return selectedTile;
    }

    _analyseMap(){
        let x =0;
        let y = 0;
        let tile = 0;
        let currentTile;

        while(y < this._worldHeight) {

            while (x < this._worldWidth) {

                currentTile = Kernel.instance._tiles[this._worldTiles[tile]];

                if(currentTile instanceof SpawnerTile) {
                    App.addEntity(new Spawner(x*32,y*32));
                }

                x++;
                tile++;
            }
            x= 0;

            y++;
        }
    }

    getWorld(){
        return this._worldTiles;
    }

    getWorldHeight(){
        return this._worldHeight;
    }

    getWorldWidth(){
        return this._worldWidth;
    }


}