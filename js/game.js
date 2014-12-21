var TTPP = function(){
    var _this = this;

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

        /**
         * Players sprites
         */
        //_this.game.load.spritesheet('player1','assets/player1.png',54,95);
        //_this.game.load.spritesheet('player2','assets/player2.png');
        /**
         * png player 3 - 1650px x 468px
         */
        _this.game.load.spritesheet('player3','assets/player3.png',54,108,48);
        _this.game.load.spritesheet('dude','assets/dude.png',32,48);



    }

    _this.create = function(){
        _this.buildWorld();

        _this.createPlayer('player3');

        _this.buildControls();
    }

    _this.update = function(){

        _this.processActions();
    }

    _this.processActions = function(){
        //  Reset the players velocity (movement)
        _this.player.body.velocity.x = 0;

        if (_this.cursors.left.isDown) {
            //  Move to the left
            _this.player.body.velocity.x = -150;

            _this.player.animations.play('left');
        }else if (_this.cursors.right.isDown){
            //  Move to the right
            _this.player.body.velocity.x = 150;
            //_this.player.animations.play('right');

        }
        else if(_this.cursors.down.isDown){
            _this.player.body.velocity.y = 150;
            _this.player.animations.play('right');
        }
        else if(_this.cursors.up.isDown){
            _this.player.body.velocity.y = -150;
            _this.player.animations.play('left');
        }
        else {
            //  Stand still
            _this.player.animations.stop();
            _this.player.frame = 4;
        }

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

    _this.createPlayer = function(asset){
        _this.player = _this.game.add.sprite(_this.width / 2,0,asset);
        _this.game.physics.arcade.enable(_this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        //Cuando se agrega Physics, el objeto obtiene la propiedad body para modificar parametros de physics
        //_this.player.body.bounce.y = 0.2;
        //_this.player.body.gravity.y = 300;
        _this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        _this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        _this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        _this.player.animations.add('walk');
    }


    _this.buildControls = function(){
        _this.cursors = _this.game.input.keyboard.createCursorKeys();
    }

}

new TTPP().init();

