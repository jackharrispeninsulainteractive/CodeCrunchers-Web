<?php

if (PHP_SAPI == 'cli-server') {
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) return false;
}

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Code Crunchers Game</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
    <style>


        *{
            padding:0;
            margin:0;
            overflow: hidden;
            font-family: "Pixelify Sans", sans-serif;
            font-optical-sizing: auto;
            font-weight: normal;
            font-style: normal;

        }

        canvas{
            image-rendering: pixelated;

        }


    </style>
</head>
<body>

<script src="https://assets.peppermintcloud.com.au/simpleui/SnapLoad.js"></script>

<script>
    SnapLoad.addRepository("code-crunchers","/static");
</script>

<canvas id="gameWindow"></canvas>

<script>
    SnapLoad.require([
        "code-crunchers.core.Kernel",
        "code-crunchers.tiles.Tile",
        "code-crunchers.tiles.FloorTile",
        "code-crunchers.tiles.AirTile",
        "code-crunchers.tiles.InteriorDoorTile",
        "code-crunchers.tiles.InteriorTile",
        "code-crunchers.tiles.SpawnerTile",
        "code-crunchers.gfx.SpriteSheet",

        "fileReader.image('/static/res/textureMap_v6.4.png')",
        "fileReader.text('/static/res/WORLDS.txt')",
        "fileReader.fontFace('Minecraft','/static/res/Minecraft.ttf')",
        "fileReader.image('/static/res/CodeCrunchers-Logo.png')",

        "fileReader.audio('/static/res/sfx/Attack.wav')",
        "fileReader.audio('/static/res/sfx/Footstep.wav')",
        "fileReader.audio('/static/res/sfx/Hurt.wav')",
        "fileReader.audio('/static/res/sfx/Jump.wav')",
        "fileReader.audio('/static/res/sfx/Music1.wav')",
        "fileReader.audio('/static/res/sfx/Music2.wav')",
        "fileReader.audio('/static/res/sfx/Music3.wav')",
        "fileReader.audio('/static/res/sfx/Music4.wav')",
        "fileReader.audio('/static/res/sfx/UI_Quirky21.wav')",
        "fileReader.audio('/static/res/sfx/SynthChime4.wav')",

        "code-crunchers.core.LevelGenerator",
        "code-crunchers.entities.Entity",
        "code-crunchers.entities.Player",
        "code-crunchers.core.KeyboardManager",
        "code-crunchers.facades.App",
        "code-crunchers.gfx.Animation",
        "code-crunchers.gfx.Camera",
        "code-crunchers.entities.Spawner",
        "code-crunchers.entities.Enemy",
        "code-crunchers.entities.PowerUp",
        "code-crunchers.gui.InterfaceObject",
        "code-crunchers.gui.Button",
        "code-crunchers.gui.PowerUpSelector",

        "code-crunchers.core.MouseManager",
        "code-crunchers.geometry.Rectangle",

        "code-crunchers.states.State",
        "code-crunchers.states.MenuState",
        "code-crunchers.states.GameState",
        "code-crunchers.states.SettingsState",
        "code-crunchers.states.PauseState",
        "code-crunchers.states.GameOverState",
        "code-crunchers.states.GameCompletedState",
        "code-crunchers.states.HighScoresState",
        "code-crunchers.helpers.Cookie"

    ],function (resources) {

        //Set our font
        document.fonts.add(resources.get("Minecraft"));
        document.body.style.fontFamily = "Minecraft";

        //Setup our game

        let kernel = new Kernel("gameWindow");

        kernel.setWorld(resources.get("fileReader.text('/static/res/WORLDS.txt')"));
        kernel.setSpriteSheet(resources.get("fileReader.image('/static/res/textureMap_v6.4.png')"),32);

        Kernel.instance.setResources(resources);
        Kernel.instance.start();

    },SnapLoad.LOAD_TYPE_SYNCHRONOUS);
</script>



</body>
</html>
