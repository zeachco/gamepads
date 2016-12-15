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

debug('hello world');

class Gamepad {
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

class GamepadController {
    constructor() {
        this.gamepadHandler = this.gamepadHandler.bind(this);
        this.loop = this.loop.bind(this);
        this.renderGamepad = this.renderGamepad.bind(this);
        this.gamepads = {};
        this.state = {};
        window.addEventListener("gamepadconnected", e => this.gamepadHandler(e, true), false);
        window.addEventListener("gamepaddisconnected", e => this.gamepadHandler(e, false), false);
    }

    gamepadHandler(e, connecting) {
        var gamepad = e.gamepad;
        if (connecting) {
            this.gamepads[gamepad.index] = new Gamepad(e.gamepad);
        } else {
            this.gamepads[gamepad.index].destroy()
            delete this.gamepads[gamepad.index];
        }
        console.log(this.gamepads);
    }

    renderGamepad() {
        for (var pad in this.gamepads) {
            if (this.gamepads.hasOwnProperty(pad)) {
                const gamepad = this.gamepads[pad];
                gamepad.pad.buttons.forEach((button, index) => {
                    gamepad.state['button-' + index] = button.value;
                });
                gamepad.pad.axes.forEach((axis, index) => {
                    gamepad.state['axis-' + index] = Math.round(axis * 10000) / 100;
                });
                gamepad.render();
            }
        }
    }

    loop() {
        this.renderGamepad();
        requestAnimationFrame(this.loop);
    }
}

export default new GamepadController();