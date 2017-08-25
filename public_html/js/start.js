

document.body.appendChild(app.view);

room.loader.setup();

loader.add("assets/pongping.json")
        .on('progress', room.loader.loading)
        .load(setup);

function loop() {
    if(room.loop.method !== null) {
        if(room.loop.bindTo !== null) room.loop.method.bind(room.loop.bindTo)();
        else room.loop.method();
    }
    render();
    requestAnimationFrame(loop);
}
