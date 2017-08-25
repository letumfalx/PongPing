
var textures;
var key;
function loaded() {
    room.loader.loading();
}

room.loader = {
    data: {
        stage: new Container(),
        load: {
            total: 6,
            current: 0
        }
    },
    methods: {
        loading: function() {
            room.loader.progress.text = Math.floor(++room.loader.load.current 
                    * 100 / room.loader.load.total) + "%";
            
        }
    },
    init: function() {
        for(let key in room.loader.data) {
            room.loader[key] = room.loader.data[key];
        }
        for(let key in room.loader.methods) {
            room.loader[key] = room.loader.methods[key];
        }
    },
    setup: function() {
        room.loader.init();
        createObject(new Text("Loading...", styles.title), room.loader.stage,
                room.width/2, room.height*0.4, 0.5);
        room.loader.progress = createObject(new Text("0%", styles.subtitle), 
                room.loader.stage, room.width/2, room.height*0.6, 0.5);
        room.current.set(room.loader.stage);
        render();
    }
};

room.menu = {
    data: {
        movePlay: {
            is: false,
            frame: 30,
            count: 0,
            opacity: 0,
            moved: false,
            reset: function() {
                room.menu.movePlay.is = false;
                room.menu.movePlay.count = 0;
                room.menu.movePlay.moved = false;
            }
        },
        stage: new Container(),
        button: {}
    },
    methods: {
        
    },
    init: function() {
        for(let key in this.data) {
            this[key] = this.data[key];
        }
        for(let key in this.methods) {
            this[key] = this.methods[key];
        }
    },
    setup: function() {
        this.init.bind(this)();
        
        createObject(new Sprite(textures['title.png']), this.stage,
                room.width/2, room.height/7, 0.5);
        
        this.button.play = createObject(new Sprite(textures['play-default.png']),
                this.stage, room.width/2, room.height*.7, 0.5);
        
        this.button.play.moveTo = (room.height*.7 - room.height * .5) / this.movePlay.frame;
        this.button.play.shrinkTo = 0.5 / this.movePlay.frame;
        
        this.button.play.sprites = {
            default: textures['play-default.png'],
            hover: textures['play-hover.png'],
            clicked: textures['play-clicked.png'],
            selected: textures['play-selected.png']
        };
        
        this.button.play.buttonMode = true;
        this.button.play.interactive = true;
        this.button.play.stats = {
            inside: false,
            clicked: false,
            selected: false
        };
        
        this.button.play.on('pointerdown', function() {
            if(this.stats.selected) return;
            this.stats.clicked = true;
            this.setTexture(this.stats.inside ? this.sprites.clicked 
                    : this.sprites.default);
        }.bind(this.button.play));
        
        this.button.play.on('pointerup', function() {
            if(this.stats.selected) return;
            this.stats.clicked = false;
            this.stats.selected = true;
            this.setTexture(this.sprites.selected);
            //do the animation here
            room.menu.movePlay.is = true;
        }.bind(this.button.play));
        
        this.button.play.on('pointerupoutside', function() {
            if(this.stats.selected) return;
            this.stats.clicked = false;
        }.bind(this.button.play));
        
        this.button.play.on('pointerover', function() {
            if(this.stats.selected) return;
            this.stats.inside = true;
            this.setTexture(this.stats.clicked ? this.sprites.clicked 
                    : this.sprites.hover);
        }); 
        
        this.button.play.on('pointerout', function() {
            if(this.stats.selected) return;
            this.stats.inside = false;
            this.setTexture(this.sprites.default);
        }.bind(this.button.play));
        
        this.movePlay.opacity = 1 / this.movePlay.frame;
        
        this.button.easy = createObject(new Sprite(textures['easy-default.png']),
            this.stage, 3*room.width/20, room.height*0.75, 0.5);
        this.button.easy.keyword = 'easy';
        
        this.button.normal = createObject(new Sprite(textures['normal-default.png']),
            this.stage, room.width/2, room.height*0.75, 0.5);
        this.button.normal.keyword = 'normal';
            
        this.button.hard = createObject(new Sprite(textures['hard-default.png']),
            this.stage, 17*room.width/20, room.height*0.75, 0.5);
        this.button.hard.keyword = 'hard';
        
        this.button.difficulty = [
            this.button.easy,
            this.button.normal,
            this.button.hard
        ];
        
        for(let i in this.button.difficulty) {
            this.button.difficulty[i].alpha = 0.0;
            this.button.difficulty[i].sprites = {
                default: textures[this.button.difficulty[i].keyword + '-default.png'],
                hover: textures[this.button.difficulty[i].keyword + '-hover.png'],
                clicked: textures[this.button.difficulty[i].keyword + '-clicked.png']
            };
            this.button.difficulty[i].buttonMode = false;
            this.button.difficulty[i].interactive = false;
            this.button.difficulty[i].stats = { inside: false, clicked: false };
            
            this.button.difficulty[i].on('pointerdown', function() {
                this.stats.clicked = true;
                this.setTexture(this.stats.inside ? this.sprites.clicked : this.sprites.default);
            }.bind(this.button.difficulty[i]));
            
            this.button.difficulty[i].on('pointerup', function() {
                this.stats.clicked = false;
                //next room here
                this.setTexture(this.sprites.hover);
                //reset 
                room.game.difficulty = i;
                setRoom(room.game, true);
            }.bind(this.button.difficulty[i]));
            
            this.button.difficulty[i].on('pointerupoutside', function() {
                this.stats.clicked = false;
                this.setTexture(this.sprites.default);
            }.bind(this.button.difficulty[i]));
            
            this.button.difficulty[i].on('pointerover', function() {
                this.stats.inside = true;
                this.setTexture(this.stats.clicked ? this.sprites.clicked : this.sprites.hover);
            }.bind(this.button.difficulty[i]));
            
            this.button.difficulty[i].on('pointerout', function() {
                this.stats.inside = false;
                this.setTexture(this.sprites.default);
            }.bind(this.button.difficulty[i]));
        }
        
        this.button.reset = function() {
            this.play.setTexture(this.play.sprites.default);
            this.play.interactive = true;
            this.play.buttonMode = true;
            this.play.stats.inside = false;
            this.play.stats.clicked = false;
            this.play.stats.selected = false;
            setPosition(this.play, room.width/2, room.height*.7, 0.5);
            this.play.scale.set(1, 1);
            
            for(let i in this.difficulty) {
                this.difficulty[i].setTexture(this.difficulty[i].sprites.default);
                this.difficulty[i].stats.inside = false;
                this.difficulty[i].stats.clicked = false;
                this.difficulty[i].alpha = 0.0;
                this.difficulty[i].buttonMode = false;
                this.difficulty[i].interactive = false;
            }
        };
        
        
        key.enter.addReleaseEvent(function() {
            if(!room.current.compare(room.menu)) return;
            if(!room.menu.movePlay.is && !room.menu.movePlay.moved) {
                this.play.stats.clicked = false;
                this.play.stats.selected = true;
                this.play.setTexture(this.play.sprites.selected);
                room.menu.movePlay.is = true;
            }
            else if(room.menu.movePlay.moved) {
                room.game.difficulty = 1;
                setRoom(room.game, true);
            }
            
        }, this.button);
        
        loaded();
    },
    loop: function() {
        if(this.movePlay.is) {
            this.movePlay.moved = true;
            this.button.play.y -= this.button.play.moveTo;
            this.button.play.scale.x -= this.button.play.shrinkTo;
            this.button.play.scale.y -= this.button.play.shrinkTo;
            for(let i in this.button.difficulty) 
                this.button.difficulty[i].alpha += this.movePlay.opacity;
            if(++this.movePlay.count >= this.movePlay.frame) {
                this.movePlay.is = false;
                for(let i in this.button.difficulty) {
                    this.button.difficulty[i].alpha = 1.0;
                    this.button.difficulty[i].buttonMode = true;
                    this.button.difficulty[i].interactive = true;
                }
                this.button.play.interactive = false;
                this.button.play.buttonMode = false;
            }
        }
    },
    reset: function() {
        this.button.reset.bind(this.button)();
        this.movePlay.reset();
    }
};


room.game = {
    data: {
        stage: new Container(),
        difficulty: 0,
        currentLoop: null,
        maxVelocity: 30,
        brickCount: {
            row: 6,
            col: 10
        },
        score: 0,
        highscore: 0,
        frames: 0,
        bonus: {
            brick: [ 4000, 5000, 6000 ]
        }
    },
    methods: {
        pause: function() {
            
        },
        play: function() {
            
            if(this.bricks.available.length <= 0) {
                setRoom(rm.score, true);
            }
            
            
            this.ball.x += this.ball.vx;
            this.ball.y += this.ball.vy;
            
            //bounced to the wall
            if(this.ball.x < room.bounds.left + this.ball.width/2) {
                this.col = false;
                this.bounce.bind(this.ball)();
                this.moveDir(this.ball, this.ball.velocity, 
                        -this.ball.vx, this.ball.vy);
            }
            
            if(this.ball.x > room.bounds.right - this.ball.width/2) {
                this.col = false;
                this.bounce.bind(this.ball)();
                this.moveDir(this.ball, this.ball.velocity, 
                        -this.ball.vx, this.ball.vy);
            }
            
            if(this.ball.y < room.bounds.top + this.ball.height/2) {
                this.col = false;
                this.bounce.bind(this.ball)();
                this.moveDir(this.ball, this.ball.velocity, 
                        this.ball.vx, -this.ball.vy);
            }
            
            if(this.ball.y > room.bounds.bottom - this.ball.height/4) {
                this.col = false;
                setRoom(room.score, true);
            }
            
            //bounced to bricks
            for(let i in this.bricks.available) {
                let col = b.hit(this.ball, this.bricks.available[i], true);
                
                if(col != null) {
                    this.ball.col = false;
                    if(col === 'bottom' || col === 'top') {
                        this.moveDir(this.ball, this.ball.velocity, 
                            this.ball.vx, -this.ball.vy);
                    }
                    else if(col === 'left' || col === 'right'){
                        this.moveDir(this.ball, this.ball.velocity, 
                            -this.ball.vx, this.ball.vy);
                    }
                    let diff = Number(room.game.difficulty);
                    
                    this.score += 50 + Mathf.clamp(this.bonus.brick[diff] - this.frames,
                                299, this.bonus.brick[diff]);
                    this.bricks.available[i].visible = false;
                    this.bricks.available = 
                            this.bricks.available.filter(function(obj) {
                                return obj.visible;
                            });
                    break;
                }
            }
            
            //bounced to the player
            let col = b.hit(this.ball, this.player, true, false);
            
            if(col != null) {
                if(this.ball.col) return;
                this.ball.col = true;
                this.bounce.bind(this.ball)();
                if(col === 'bottom' || col === 'top') {
                    if(this.ball.side) return;
                    let dir = -this.ball.vx/Math.abs(this.ball.vx);
                    let dist = ((this.ball.x - this.player.x) / (this.player.width/2)) * dir;
                    let angle = Mathf.clamp360(Mathf.deg(Math.atan2(-this.ball.vy, this.ball.vx)));
                    
                    if(angle > 270) {
                        //angle = Math.clamp();
                        angle += 50 * dist;
                        angle = Mathf.rad(Mathf.clamp(angle, 290, 340));
                    }
                    else {
                        angle += 50 * dist;
                        angle = Mathf.rad(Mathf.clamp(angle, 200, 250));
                        
                    }
                    
                    this.moveDir(this.ball, this.ball.velocity, 
                        Math.cos(angle), -Math.abs(Math.sin(angle)));
                        //this.ball.vx, -this.ball.vy);
                        
                        /*
                    this.ball.y = col === 'bottom' ? 
                            this.player.y - this.ball.height/2 - this.player.height/2 - 1 : 
                            this.player.y + this.ball.height/2 + this.player.height/2 + 1;
                            */
                    this.ball.y = this.player.y - this.ball.height/2 - this.player.height/2 - 1 ;
               }
               else if(col === 'left' || col === 'right') {
                    this.moveDir(this.ball, this.ball.velocity, 
                        -this.ball.vx, this.ball.vy);
                    this.ball.side = true;
               }
            }
            
            if(key.left.down && !this.ball.side) {
                    this.player.x -= key.shift.down ? this.player.move.slow 
                            : this.player.move.default;
            }

            if(key.right.down && !this.ball.side) {
                this.player.x += key.shift.down ? this.player.move.slow 
                        : this.player.move.default;
            }
            
            this.player.y = this.player.py;
            this.player.x = Mathf.clamp(this.player.x, room.bounds.left 
                    + this.player.width/2, room.bounds.right 
                    - this.player.width/2);
            
            this.ball.x = Mathf.clamp(this.ball.x, room.bounds.left 
                    + this.ball.width/2, room.bounds.right - this.ball.width/2);
            this.ball.y = Mathf.clamp(this.ball.y, room.bounds.top 
                    + this.ball.height/2, room.bounds.bottom);
            
            this.frames++;
            if(this.yourscore.ticker < this.score) {
                this.yourscore.ticker += 537;
            }
            if(this.yourscore.ticker > this.score) {
                this.yourscore.ticker = this.score;
            }
            this.yourscore.text = this.yourscore.ticker;
        },
        bounce: function() {
            this.velocity += 0.075 * (Number(room.game.difficulty) + 1);
            this.sprites.next.bind(this)();
        },
        moveTo: function(obj, speed, x, y) {
            if(speed > room.game.maxVelocity) speed = room.game.maxVelocity;
            obj.velocity = speed;
            let angle = Math.atan2(y - obj.y, x - obj.x);
            obj.vx = speed * Math.cos(angle);
            obj.vy = speed * Math.sin(angle);
        },
        moveDir: function(obj, speed, x, y) {
            if(speed > room.game.maxVelocity) speed = room.game.maxVelocity;
            obj.velocity = speed;
            let angle = Math.atan2(y, x);
            obj.vx = speed * Math.cos(angle);
            obj.vy = speed * Math.sin(angle);
        }
    },
    init: function() {
        for(let key in this.data) {
            this[key] = this.data[key];
        }
        for(let key in this.methods) {
            this[key] = this.methods[key];
        }
    },
    setup: function() {
        this.init.bind(this)();
        
        //create horizontal wall
        let tmp_wall = new Sprite(textures['wall.png']);
        room.bounds.left = tmp_wall.width / 2;
        room.bounds.right = room.width - room.bounds.left;
        room.bounds.top = tmp_wall.height;
        room.bounds.bottom = room.height - room.bounds.top;
        
        //walls
        this.wall = createObject(new Container(), this.stage);
        let hc = Math.floor(room.width / tmp_wall.width) + 1;
        for(let i=0; i<hc; ++i) {
            createObject(new Sprite(textures['wall.png']), this.wall,
                    tmp_wall.width * (i - 0.25), 0);
        }
        
        let vc = Math.floor(room.height / tmp_wall.height);
        for(let i=0; i<vc; ++i) {
            createObject(new Sprite(textures['wall.png']), this.wall,
                    -tmp_wall.width/2, tmp_wall.height * (i+1));
            createObject(new Sprite(textures['wall.png']), this.wall,
                    room.bounds.right, tmp_wall.height * (i+1));
        }
        
        this.player = createObject(new Sprite(textures['player.png']), 
                    this.stage, room.width/2, room.height*0.9, 0.5);
        this.player.move = {
            default: room.width * 0.025,
            slow: room.width * 0.008
        };
        
        this.player.py = this.player.y;
        
        this.player.reset = function() {
            this.position.set(room.width/2, room.height*0.9);
        };
        
        this.bricks = createObject(new Container(), this.stage, 0, 0);
        let tmp_brick = new Sprite(textures['brick.png']);
        
        
        for(let i=0; i<this.brickCount.row; ++i) {
            for(let j=0; j<this.brickCount.col; ++j) {
                createObject(new Sprite(textures['brick.png']), 
                        this.bricks, (tmp_brick.width + 1) * j,
                        (tmp_brick.height + 1) * i);
            }
        }
        
        setPosition(this.bricks, room.width/2 - this.bricks.width/2, 
                room.height * .3 - this.bricks.height/2);
                
        this.bricks.available = this.bricks.children;
        
        this.ball = createObject(new Sprite(textures['ball0.png']),
                this.stage, 0, 0, 0.5, 0.5);
                
        this.ball.sprites = {
            container: [],
            index: 0,
            next: function() {
                this.sprites.index = Mathf.next(this.sprites.index, 0, this.sprites.container.length - 1);
                this.setTexture(this.sprites.container[this.sprites.index]);
            }
        };
        for(let i=0; i<8; ++i) {
            this.ball.sprites.container.push(textures['ball' + i + ".png"]);
        }
        
        this.ball.col = false;
        
        this.ball.reset = function() {
            //this.ball.col.current = this.ball.col.none;
            this.ball.col = false;
            this.ball.side = false;
            this.ball.position.set(Math.random() > 0.5 ? room.width/4 : 3*room.width/4, room.height/2);
            this.ball.setTexture(this.ball.sprites.container[0]);
            this.ball.spriteIndex = 0;
            this.moveTo(this.ball, 4 + 1.5 * Number(this.difficulty), this.player.x, 
                    this.player.y - this.player.height/2 - this.ball.height/2);
        };
        
        this.debug = createObject(new Text("", styles.debug), this.stage, room.width/2, room.height/2, 0.5);
        
        this.yourscore = createObject(new Text("0", new TextStyle({
            fontFamily: 'Century Gothic',
            fontSize: 24,
            fill: ['#ffffff', '#8f8f8f']
        })), this.stage, room.width*0.5, room.height, 0, 1);
        
        this.yourscore.ticker = 0;
        
        this.yourscore.reset = function() {
            this.ticker = 0;
            this.text = "0";
        };
        
        
        this.diffText = createObject(new Text("diff", new TextStyle({
            fontFamily: 'Century Gothic',
            fontSize: 24
        })), this.stage, room.width * 0.4, room.height, 1, 1);
        
        this.currentLoop = this.play;
        loaded();
    },
    loop: function() {
        if(this.currentLoop !== null) this.currentLoop.bind(this)();
    },
    reset: function() {
        this.player.reset.bind(this.player)();
        for(let i in this.bricks.children) {
            this.bricks.children[i].visible = true;
        }
        this.bricks.available = this.bricks.children;
        this.ball.reset.bind(this)();
        this.yourscore.reset.bind(this.yourscore)();
        this.frames = 0;
        this.score = 0;
        switch(Number(this.difficulty)) {
            case 0: 
                this.diffText.text = "Easy";
                this.diffText.style.fill = ['#11ff00', '#00cc00'];
                break;
            case 1:
                this.diffText.text = "Normal";
                this.diffText.style.fill = ['#0011ff', '#0000cc'];
                break;
            case 2:
                this.diffText.text = "Hard";
                this.diffText.style.fill = ['#ff1100', '#cc0000'];
                break;
        };
    }
    
};


room.score = {
    data: {
        stage: new Container(),
        base: {
            completion: 100000,
            speed: 500,
            time: 50000,
            difficulty: 1000
        },
        score: {
            earned: 0,
            completion: 0,
            speed: 0,
            time: 0,
            difficulty: 0,
            total: 0
        },
        ticker: {
            earned: 0,
            completion: 0,
            speed: 0,
            time: 0,
            difficulty: 0,
            total: 0,
            whoIs: 0,
            reset: function() {
                this.earned = 0;
                this.completion = 0;
                this.speed = 0;
                this.time = 0;
                this.difficulty = 0;
                this.total = 0;
                this.whoIs = 0;
            }
        }
        
    },
    methods: {
        finalized: function() {
            if(room.score.ticker.total !== room.score.score.total) {
                room.score.ticker.completion = room.score.score.completion;
                room.score.ticker.difficulty = room.score.score.difficulty;
                room.score.ticker.time = room.score.score.time;
                room.score.ticker.earned = room.score.score.earned;
                room.score.ticker.speed = room.score.score.speed;
                room.score.ticker.total = room.score.score.total;
            }
            else {
                setRoom(room.menu, true);
            }
        }
    },
    init: function() {
        for(let key in this.data) {
            this[key] = this.data[key];
        }
        for(let key in this.methods) {
            this[key] = this.methods[key];
        }
    },
    setup: function() {
        this.init.bind(this)();
        
        //this.stage = createObject(new Container(), this.stage, 0, 0, 0, 0);
        this.style = {
            sub: new TextStyle({
                fontFamily: 'Century Gothic',
                fontSize: 30,
                fill: ['#ffffff', '#8f8f8f']
            }),
            main: {
                default: new TextStyle({
                    fontFamily: 'Century Gothic',
                    fontSize: 40,
                    fill: ['#ffffff', '#8f8f8f']
                }),
                final: new TextStyle({
                    fontFamily: 'Century Gothic',
                    fontSize: 40,
                    fill: ['#ffff00', '#8f8f00']
                })
            }
        };
        
        let label = [ "Earned", "Completion Bonus", "Velocity Bonus", "Time Bonus", "Difficulty Bonus"];
        this.numbers = [];
        for(let i=0; i<label.length; ++i) {
            let l = new Text(label[i], this.style.sub);
            l.position.set(room.width * 0.52, (room.height / 10) + room.height * 0.1 * i);
            this.stage.addChild(l);
            
            let s = new Text("0", this.style.sub);
            s.position.set(room.width * 0.40, (room.height / 10) + room.height * 0.1 * i);
            s.anchor.set(1, 0);
            this.stage.addChild(s);
            this.numbers.push(s);
        }
        
        key.enter.addReleaseEvent(function() {
            if(!room.current.compare(room.score)) return;
            this.finalized();
        }, this);
        
        this.total = {
            label: new Text("Total", this.style.main.default),
            number: new Text("0", this.style.main.default)
        };
        
        this.total.label.position.set(room.width * 0.52, room.height * 0.65);
        this.stage.addChild(this.total.label);
        
        this.total.number.position.set(room.width * 0.40, room.height * 0.65);
        this.total.number.anchor.set(1, 0);
        this.stage.addChild(this.total.number);
        
        
        let inner = createObject(new Sprite(null), this.stage, 0, 0, 0, 0);
        inner.width = room.width;
        inner.height = room.height;
        
        inner.interactive = true;
		inner.buttonMode = true;
        
        inner.on('pointerup', function() {
            this.finalized();
        }.bind(this));
        
        inner.on('pointerupoutside', function() {
            this.finalized();
        }.bind(this));
        
        loaded();
    },
    loop: function() {
        switch(this.ticker.whoIs) {
            case 0: 
                if(this.ticker.earned >= this.score.earned) {
                    this.ticker.earned = this.score.earned;
                    this.numbers[this.ticker.whoIs].text = this.ticker.earned;
                    this.ticker.whoIs++;
                    break;
                }
                this.ticker.earned += 7777;
                this.numbers[this.ticker.whoIs].text = this.ticker.earned;
                break;
            case 1:
                if(this.ticker.completion >= this.score.completion) {
                    this.ticker.completion = this.score.completion;
                    this.numbers[this.ticker.whoIs].text = this.ticker.completion;
                    this.ticker.whoIs++;
                    break;
                }
                this.ticker.completion += 4545;
                this.numbers[this.ticker.whoIs].text = this.ticker.completion;
                break;
            case 2:
                if(this.ticker.speed >= this.score.speed) {
                    this.ticker.speed = this.score.speed;
                    this.numbers[this.ticker.whoIs].text = this.ticker.speed;
                    this.ticker.whoIs++;
                    break;
                }
                this.ticker.speed += 777;
                this.numbers[this.ticker.whoIs].text = this.ticker.speed;
                break;
            case 3:
                if(this.ticker.time >= this.score.time) {
                    this.ticker.time = this.score.time;
                    this.numbers[this.ticker.whoIs].text = this.ticker.time;
                    this.ticker.whoIs++;
                    break;
                }
                this.ticker.time += 7777;
                this.numbers[this.ticker.whoIs].text = this.ticker.speed;
                break;
            case 4:
                if(this.ticker.difficulty >= this.score.difficulty) {
                    this.ticker.difficulty = this.score.difficulty;
                    this.numbers[this.ticker.whoIs].text = this.ticker.difficulty;
                    this.ticker.whoIs++;
                    break;
                }
                this.ticker.difficulty += 333;
                this.numbers[this.ticker.whoIs].text = this.ticker.difficulty;
                break;
            case 5:
                if(this.ticker.total >= this.score.total) {
                    this.ticker.total = this.score.total;
                    this.total.number.text = this.ticker.total;
                    this.total.number.style = this.style.main.final;
                    this.total.label.style = this.style.main.final;
                    this.ticker.whoIs++;
                    break;
                }
                this.ticker.total += 11223;
                this.total.number.text = this.ticker.total;
                break;
        }
    },
    reset: function() {
        this.score.earned = room.game.score;
        
        let brickRatio = 1 - (room.game.bricks.available.length / room.game.bricks.children.length);
        this.score.completion = Math.floor(this.base.completion * brickRatio);
        
        
        
        this.score.speed = Math.floor(this.base.speed * room.game.ball.velocity);
        
        this.score.time = Math.floor( Mathf.clamp(this.score.time = 
                (this.base.time - room.game.frames) * brickRatio,
                1000, this.base.time));
        this.score.difficulty = this.base.difficulty * (Number(room.game.difficulty) + 1);
        this.score.total = this.score.earned + this.score.completion + this.score.speed
                + this.score.time + this.score.difficulty;
        
        this.ticker.reset.bind(this.ticker)();
        for(let i=0; i<this.numbers.length; i++) {
            this.numbers[i].text = 0;
        }
        
        this.total.number.text = 0;
        this.total.number.style = this.style.main.default;
        this.total.label.style = this.style.main.default;
    }
};

function setup() {
    textures = resources['assets/pongping.json'].textures;
    key = {
        left: new Key(['A'.charCodeAt(0), 37]),
        right: new Key(['D'.charCodeAt(0), 39]),
        shift: new Key(16),
        enter: new Key([13, 32])
    };
    loaded();
    room.menu.setup.bind(room.menu)();
    room.game.setup.bind(room.game)();
    room.score.setup.bind(room.score)();
    setRoom(room.menu);
    loop();
}


