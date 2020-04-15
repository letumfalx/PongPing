
//aliases
var Application = PIXI.Application,
    Container = PIXI.Container,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    Sprite = PIXI.Sprite,
    AnimatedSprite = PIXI.extras.AnimatedSprite;
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    loader = PIXI.loader,
    resources = PIXI.loader.resources
    b = new Bump(PIXI);
    
var app = new Application(800, 600, { background: '#0f0f0f' });

app.view.style.position = "absolute";
app.view.style.display = "block";
app.view.style.left = ((window.innerWidth - app.view.width)*0.5);
app.view.style.top = ((window.innerHeight - app.view.height)*0.5);

room = {
    x: Number(app.view.style.left.toString().replace("px","").trim()),
    y: Number(app.view.style.top.toString().replace("px","").trim()),
    width: app.view.width,
    height: app.view.height,
    bounds: {},
    current: {
        get: function() {
            return app.stage;
        },
        set: function(rm) {
            app.stage = rm;
        },
        compare: function(rm) {
            return rm.stage === app.stage;
        }
    },
    loop: {
        method: null,
        bindTo: null
    }
};


var styles = {
    title: new PIXI.TextStyle({
        fontFamily: 'Century Gothic',
        fontSize: 48,
        fontWeight: 'bold',
        fill: ['#ffffff', '#8f8f8f'], 
        wordWrap: true,
        wordWrapWidth: 440
    }),
    subtitle:  new PIXI.TextStyle({
        fontFamily: 'Century Gothic',
        fontSize: 32,
        fill: ['#ffffff', '#8f8f8f'],
        wordWrap: true,
        wordWrapWidth: 440
    }),
    menu: {
        default: new PIXI.TextStyle({
            fontFamily: 'Century Gothic',
            fontSize: 32,
            fill: ['#ffffff', '#8f8f8f']
        }),
        selected: new PIXI.TextStyle({
            fontFamily: 'Century Gothic',
            fontSize: 32,
            fill: ['#ffff00', '#8f8f00']
        })
    },
    debug: new PIXI.TextStyle({
            fontFamily: 'Century Gothic',
            fontSize: 12,
            fill: ['#ffffff', '#8f8f8f']
        })
};


function render() {
    app.render();
};

function setLoop(rm) {
    room.loop.bindTo = rm;
    room.loop.method = rm.loop;
}

function setRoom(rm, reset=false) {
    if(reset) resetRoom(rm);
    room.current.set(rm.stage);
    setLoop(rm);
}

function resetRoom(rm) {
    rm.reset.bind(rm)();
}
