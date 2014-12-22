var TTPP = function(){
    var _this = this;
    _this.players = {};
    _this.bulletTime = 0;
    _this.knifeTime = 0;


    _this.init = function(){
        _this.heigth = 640;
        _this.width = 768;
        _this.handlers = {
             preload: _this.preload
            ,create: _this.create
            ,update: _this.update
        }
        //Game Object with handlers Methods
        //Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO
        //empty string is the id of the DOM element in which you would like
        // to insert the canvas element that Phaser creates. As we’ve left it blank it will simply be appended to the body
        _this.game = new Phaser.Game(_this.width,_this.heigth,Phaser.AUTO,'',_this.handlers);
    }

    _this.preload = function(){
        /**
         * Background Item 128x128
         */
        _this.game.load.image('grass','assets/background/light_grass.png');
        _this.game.load.image('sand','assets/background/sand.png');
        _this.game.load.image('earth','assets/background/earth.png');
        _this.game.load.image('bullet','assets/bullet_black.png');
        _this.game.load.image('knife','assets/knife.png');

        /**
         * Players sprites
         */
        //_this.game.load.spritesheet('player1','assets/player1.png',54,95);
        //_this.game.load.spritesheet('player2','assets/player2.png');
        /**
         * png player 3 - 1650px x 468px
         */
        _this.game.load.spritesheet('player3','assets/player3.png',150,117);
        _this.game.load.spritesheet('dude','assets/dude.png',32,48);
    }

    _this.create = function(){
        _this.buildWorld();

        _this.createPlayer('knife','player3',_this.arrowControls);
        _this.createPlayer('shooter','player3',_this.aswdControls);


        _this.createBullets();
        _this.createKnifes();
        _this.buildControls();
    }

    _this.update = function(){
        _this.processActions();
    }


    _this.arrowControls = function(){
        _this.player = _this.players['knife'];

        if (_this.cursors.left.isDown) {
            //  Move to the left
            _this.player.body.velocity.x = -150;
            _this.player.animations.play('left');
        }
        else if (_this.cursors.right.isDown){
            //  Move to the right
            _this.player.body.velocity.x = 150;
            _this.player.animations.play('right');
        }
        else if(_this.cursors.down.isDown){
            _this.player.body.velocity.y = 150;
            _this.player.animations.play('down');
        }
        else if(_this.cursors.up.isDown){
            _this.player.body.velocity.y = -150;
            _this.player.animations.play('up');
        }
        else {
            //  Stand still
            _this.player.animations.stop();
            _this.player.body.velocity.y = 0;
            _this.player.body.velocity.x = 0;
            //_this.player.frame = 1;
        }

        if(_this.cursors.fireKey.isDown){
            //console.log('fire knifes');
            _this.fireBullets(_this.player);
        }
    }

    _this.aswdControls = function(){
        _this.player = _this.players['shooter'];


        if (_this.leftKey.isDown) {
            //  Move to the left
            _this.player.body.velocity.x = -150;
            _this.player.animations.play('left');
        }
        else if (_this.rightKey.isDown){
            //  Move to the right
            _this.player.body.velocity.x = 150;
            _this.player.animations.play('right');
        }
        else if(_this.downKey.isDown){
            _this.player.body.velocity.y = 150;
            _this.player.animations.play('down');
        }
        else if(_this.upKey.isDown){
            _this.player.body.velocity.y = -150;
            _this.player.animations.play('up');
        }
        else {
            //  Stand still
            _this.player.animations.stop();
            _this.player.body.velocity.y = 0;
            _this.player.body.velocity.x = 0;
            //_this.player.frame = 1;
        }
        if(_this.fireKey.isDown){
            _this.fireKnifes(_this.player);
        }

    }

    _this.processActions = function(){
        //  Reset the players velocity (movement)
        _this.player.body.velocity.x = 0;
        _this.player.body.velocity.y = 0;

        _this.arrowControls();
        _this.aswdControls();

        //  Allow the player to jump if they are touching the ground.
        //if (_this.cursors.up.isDown && _this.player.body.touching.down)
        //{
        //    _this.player.body.velocity.y = -350;
        //}
    }

    _this.buildBackgroundRow = function(y,element){
        var itemsByWidth =_this.width / 128;
        for(var i = 0; i < itemsByWidth; i++){
            //x,y en el world space
            _this.game.add.sprite(i * 128 ,y,element);
        }
    }




    /**
     * Creates the background
     *
     */
    _this.buildWorld = function(){
        //  We're going to be using physics, so enable the Arcade Physics system
        _this.game.physics.startSystem(Phaser.Physics.ARCADE);

        _this.buildBackgroundRow(0,'grass');
        _this.buildBackgroundRow(128,'grass');
        _this.buildBackgroundRow(256,'sand');
        _this.buildBackgroundRow(384,'earth');
        _this.buildBackgroundRow(512,'earth');

    }

    _this.createPlayer = function(name,asset,controlsFunction){
        _this.player = _this.game.add.sprite(_this.width / 2,0,asset);
        _this.game.physics.arcade.enable(_this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        //Cuando se agrega Physics, el objeto obtiene la propiedad body para modificar parametros de physics
        //_this.player.body.bounce.y = 0.2;
        //_this.player.body.gravity.y = 0;
        _this.player.body.collideWorldBounds = true;
        _this.player.body.allowGravity = false;

        //  Our two animations, walking left and right.
        _this.player.animations.add('left', [22,23, 24,25,26,27], 10, true);
        _this.player.animations.add('right', [33,34,35,36,37,38,39], 10, true);
        _this.player.animations.add('up', [11,12,13,14,15,16], 10, true);
        _this.player.animations.add('down', [0,1,2,3,4,5,6], 10, true);

        if(typeof _this.players[name] === "undefined"){
            //_this.player.controls = controlsFunction;
            _this.players[name] = _this.player;
        }
    }

    _this.buildControls = function(){
        _this.fireKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        _this.leftKey = _this.game.input.keyboard.addKey(65);
        _this.rightKey = _this.game.input.keyboard.addKey(68);
        _this.downKey = _this.game.input.keyboard.addKey(83);
        _this.upKey = _this.game.input.keyboard.addKey(87);

        _this.cursors = _this.game.input.keyboard.createCursorKeys();
        _this.cursors.fireKey = _this.game.input.keyboard.addKey(13);//Enter
    }

    _this.createBullets = function(){
        //  Our bullet group
        _this.bullets = _this.game.add.group();
        _this.bullets.enableBody = true;
        _this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        _this.bullets.createMultiple(30, 'bullet', 0, false);
        _this.bullets.setAll('anchor.x', 0.5);
        _this.bullets.setAll('anchor.y', 0.5);
        _this.bullets.setAll('outOfBoundsKill', true);
        _this.bullets.setAll('checkWorldBounds', true);
    }

    _this.createKnifes = function(){
        //  Our bullet group
        _this.knifes = _this.game.add.group();
        _this.knifes.enableBody = true;
        _this.knifes.physicsBodyType = Phaser.Physics.ARCADE;
        _this.knifes.createMultiple(30, 'knife', 0, false);
        _this.knifes.setAll('anchor.x', 0.5);
        _this.knifes.setAll('anchor.y', 0.5);
        _this.knifes.setAll('outOfBoundsKill', true);
        _this.knifes.setAll('checkWorldBounds', true);
    }



    _this.fireBullets = function (player) {
        console.log('fire bullets');
        //  To avoid them being allowed to fire too fast we set a time limit
        if (_this.game.time.now > _this.bulletTime)
        {
            //  Grab the first bullet we can from the pool
           _this.bullet = _this.bullets.getFirstExists(false);

            if (_this.bullet)
            {
                //  And fire it
                _this.bullet.reset(player.x+54, player.y+30);
                _this.bullet.body.velocity.y = -150;
                _this.bulletTime = _this.game.time.now + 300;
            }
        }
    }
    _this.fireKnifes = function (player) {
        console.log('fire knife');
        //  To avoid them being allowed to fire too fast we set a time limit
        if (_this.game.time.now > _this.knifeTime)
        {
            //  Grab the first bullet we can from the pool
           _this.knife = _this.knifes.getFirstExists(false);

            if (_this.knife)
            {
                //  And fire it
                _this.knife.reset(player.x+54, player.y+30);
                _this.knife.body.velocity.y = -250;
                _this.knifeTime = _this.game.time.now + 300;
            }
        }
    }

}

new TTPP().init();

