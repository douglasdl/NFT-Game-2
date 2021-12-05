/** Connect to Moralis server */
const serverUrl = "https://mafyxwo9omwk.usemoralis.com:2053/server";
const appId = "vq9LTF5Yg2zavzYw5h2pAUUy6I4F4VOxfZKRPvKn";
Moralis.start({ serverUrl, appId });




document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;



var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game;
var platforms;
var player;
var cursors;
var jumpHeight = 200;



function launch () {
    let user = Moralis.User.current();
    if (!user) {
        console.log("Please login first");
    } else {
        game = new Phaser.Game(config);
        user.get('ethAddress')
    }
}

launch();


function preload () {
    this.load.image('background', 'assets/BG.png');
    this.load.image('ground', 'assets/Tiles/Tile (2).png');
    this.load.image('player', 'assets/Player.png');

}

function create () {
    this.add.image(400, 300, 'background').setScale(0.55);
    platforms = this.physics.add.staticGroup();

    platforms.create(470, 568, 'ground').setScale(0.5).refreshBody();
    platforms.create(535, 568, 'ground').setScale(0.5).refreshBody();
    platforms.create(600, 568, 'ground').setScale(0.5).refreshBody();
    platforms.create(665, 568, 'ground').setScale(0.5).refreshBody();

    player = this.physics.add.sprite(600, 150, 'player').setScale(0.3).refreshBody();
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();
}

function update () {
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        //player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        //player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        //player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-jumpHeight);
    }
}


/** Add from here down */
async function login() {
    let user = Moralis.User.current();
    if (!user) {
        try {
            user = await Moralis.authenticate({ signingMessage: "Hello World!" })
        
            launch();
  
            console.log(user)
            console.log(user.get('ethAddress'))
        } catch(error) {
            console.log(error)
        }
    }
}
  
async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
    location.reload();
}


/** Useful Resources  */

// https://docs.moralis.io/moralis-server/users/crypto-login
// https://docs.moralis.io/moralis-server/getting-started/quick-start#user
// https://docs.moralis.io/moralis-server/users/crypto-login#metamask

/** Moralis Forum */

// https://forum.moralis.io/