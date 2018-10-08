import autobind from 'auto-bind'

import { Driver } from './Driver';

export class Mouse extends Driver {
  register() {
    addEventListener('mousemove', this._move);
    addEventListener('mousewheel', this._scroll);
    addEventListener('mouseup', this._up);
    addEventListener('mousedown', this._down);
    addEventListener('contextmenu', this.prevent);
  }

  unregister() {
    removeEventListener('mousemove', this._move);
    removeEventListener('mousewheel', this._scroll);
    removeEventListener('mouseup', this._up);
    removeEventListener('mousedown', this._down);
    removeEventListener('contextmenu', this.prevent);
  }

  _cancel(e) {
    e.preventDefault();
  }

  _up(event) {
    this.set(event.which, false)
  }

  _down(event) {
    this.set(event.which, true)
  }

  _scroll(event) {
    let oz = this.z;
    this.z += event.wheelDelta > 0 ? 1 : -1;
    this._vz = this.vz + this.z - oz;
  }

  _move(event) {
    let ox = this.x;
    let oy = this.y;
    this.x = event.x;
    this.y = event.y;
    this._vx = this.vx + this.x - ox;
    this._vy = this.vy + this.y - oy;
    this.debug(this)
  }

  get vx() {
    let val = this._vx || 0;
    if (this.autoreset)
      this._vx = 0;
    return val;
  }

  get vy() {
    let val = this._vy || 0;
    if (this.autoreset)
      this._vy = 0;
    return val;
  }

  get vz() {
    let val = this._vz || 0;
    if (this.autoreset)
      this._vz = 0;
    return val;
  }

  get ratio() {
    return {
      x: this.x / window.innerWidth,
      y: this.y / window.innerHeight
    }
  }

  get relative() {
    return {
      x: (this.x / window.innerWidth) - 0.5,
      y: (this.y / window.innerHeight) - 0.5
    }
  }
}
