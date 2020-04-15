class Mathf {
    static random(min, max, outInt = true, exclude = []) {
        if(outInt ? Math.floor(min) === Math.floor(max) && exclude.indexOf(Math.floor(min)) > -1
                : min === max && exclude.indexOf(Math.floor(min)) > -1) {
            return min;
        }
        for(;;) {
            let num = (Math.random() * (max - min + outInt ? 1 : 0.001)) + min;
            num = outInt ? Math.floor(num) : num;
            if(exclude.indexOf(num) <= -1) return num;
        }
    };
    
    static rad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    static deg(radians) {
        return (radians / Math.PI) * 180;
    }
    
    static clamp(value, min, max) {
        return min === max ? min : min < max ? 
                (value < min ? min : value > max ? max : value)
                : (value > max && value < min ? 
                Math.abs(min - value) > Math.abs(max - value) 
                ? max : min : value);
    }
    static next(value, min, max) {
        if(max > min) {
            value++;
            if(value > max) value = min;
            return value;
        }
        if(min > max) {
            value--;
            if(value < min) value = max;
            return value;
        }
        return min;
    }
    
    static clamp360(angle) {
        if(angle > 0) return angle % 360;
        if(angle < 0) {
            while(angle < 0) angle += 360;
        }
        return angle;
    }
    
    static clamp2pi(angle) {
        if(angle > Math.PI * 2) {
            while(angle > Math.PI * 2) {
                angle -= Math.PI * 2;
            }
        }
        if(angle < 0) {
            while(angle < 0) angle += Math.PI * 2;
        }
        return angle;
    }
}

class Key {
    constructor(key) {
        this.keys = [];
        if(key.constructor === Array) {
            for(let i in key) {
                this.keys.push(key[i]);
            }
        }
        else {
            this.keys.push(key);
        }
        this.up = true;
        this.down = false;
        this.press = [];
        this.release = [];
        this.onUp = function(event) {
            if(this.up) return;
            if(this.containKey(event.keyCode)) {
                this.up = true;
                this.down = false;
                for(let i in this.release) {
                    if(this.release[i].bind !== null) this.release[i].method.bind(this.release[i].bind)();
                    else this.release[i].method();
                }
            }
            event.preventDefault();
        };
        this.onDown = function(event) {
            if(this.down) return;
            if(this.containKey(event.keyCode)) {
                this.up = false;
                this.down = true;
                for(let i in this.press) {
                    if(this.press[i].bind !== null) this.press[i].method.bind(this.press[i].bind)();
                    else this.press[i].method();
                }
            }
            event.preventDefault();
        };
        window.addEventListener('keydown', this.onDown.bind(this), false);
        window.addEventListener('keyup', this.onUp.bind(this), false);
    }
    
    containKey(code) {
        return this.keys.indexOf(code) > -1;
    }
    
    addPressEvent(callback, bindTo = null) {
        this.press.push( { method: callback, bind: bindTo } );
    }
    
    addReleaseEvent(callback, bindTo = null) {
        this.release.push( { method: callback, bind: bindTo } );
        
    }
    
    clear() {
        this.press = [];
        this.release = [];
    }
}


function createObject(obj, container, x=0, y=0, ax=0, ay=null, isCircular = false) {
    setPosition(obj, x, y, ax, ay);
    container.addChild(obj);
    obj.isCircular = isCircular;
    return obj;
}

function setPosition(obj, x=0, y=0, ax=0, ay=null) {
    if(ay===null) ay = ax;
    if(obj.anchor) obj.anchor.set(ax,ay);
    obj.position.set(x,y);
}

function checkPointOnRectangle(x, y, rx, ry, w, h) {
    return x >= rx && x <= rx + w && y >= ry && y <= ry + h;
}

function point(ix, iy) {
    return {x: ix, y: iy};
}

function dimension(iw, ih) {
    return {w: iw, h: ih};
}

function rect(ix, iy, iw, ih) {
    return { x: ix, y: iy, w: iw, h: ih };
}


