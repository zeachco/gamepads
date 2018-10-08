import autobind from 'auto-bind'

import { Driver } from './Driver';

function debug(message) {
    if (typeof message !== 'string') {
        message = JSON.stringify(message, null, 2);
    }
    const p = document.createElement('p');
    p.innerHTML = `<span style="color: #888;font-size: .75em;">${new Date()}</span><br/>${message}`;
    document.body.insertBefore(p, document.body.childNodes[0]);

    setTimeout(() => {
        document.body.removeChild(p);
    }, 3000);
}

export class Gamepad {
    constructor(gamepad) {
        this.pad = gamepad;
        this.state = {};
        this.el = document.createElement('div');
        this.el.className = 'controller';
        document.body.appendChild(this.el);
        debug(`Gamepad connected at index ${this.pad.index}: ${this.pad.id}. ${this.pad.buttons.length} buttons, ${this.pad.axes.length} axes.`);
    }


    render() {
        const keys = Object.keys(this.state);
        const values = keys.map(k=>`${k}: ${this.state[k]}`).map(html=> `<li>${html}</li>`)
        this.el.innerHTML = `
<fieldset class="gamepad">
    <legend>${this.pad.id}-${this.pad.index}</legend>
    <ul>${values.join('')}</ul>
</fieldset>`;
    }

    destroy() {
        debug(`Gamepad disconnected from index ${this.pad.index}: ${this.pad.id}`);
        document.body.removeChild(this.el);
    }
}

export class Gamepads {
    register() {
        addEventListener("gamepadconnected", this._onControllerAdd, false);
        addEventListener("gamepaddisconnected", this._onControllerRemove, false);
    }

    unregister() {
        addEventListener("gamepadconnected", e => this._onControllerAdd);
        addEventListener("gamepaddisconnected", e => this._onControllerRemove);
    }

    _changeControllerState (e, connecting) {
        var gamepad = e.gamepad;
        // if (connecting) {
        //     this.gamepads[gamepad.index] = new Gamepad(e.gamepad);
        // } else {
        //     this.gamepads[gamepad.index].destroy()
        //     delete this.gamepads[gamepad.index];
        // }
        console.log(this.gamepads);
    }

    _onControllerAdd(e) {
        this._changeControllerState(e, true)
    }

    _onControllerRemove(e) {
        this._changeControllerState(e, false)
    }

    _up(event) {
        this._keys[event.which] = false;
    }

    _down(event) {
        if (this.log) {
            console.debug(event.which, true);
        }
        this._keys[event.which] = true;
    }

    alias(name, key) {
        this._alias[name] = key;
        const get = () => this.state(key)
        Object.defineProperty(this, name, { get });
    }

    state(key) {
        return typeof key === 'number' ? this._keys[key] : this._keys[this._alias[key]];
    }

    down(key) {
        return this.state(key);
    }

    up(key) {
        return !this.state(key);
    }
}
