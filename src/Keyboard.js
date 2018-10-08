import autobind from 'auto-bind'

import { Driver } from './Driver';

export class Keyboard extends Driver {
    register() {
        addEventListener('keyup', this._up);
        addEventListener('keydown', this._down);
    }

    unregister() {
        removeEventListener('keyup', this._up);
        removeEventListener('keydown', this._down);
    }

    _up(event) {
        this.set(event.which, false)
    }

    _down(event) {
        this.set(event.which, true)
    }
}
