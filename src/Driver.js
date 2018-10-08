import autobind from 'auto-bind'

export class Driver {
    constructor(autoRegister = true) {
        autobind(this)
        this._values = {};
        this._alias = {};
        this.log = true
        if (autoRegister) {
            this.register();
        }
        this.debug(this.constructor.name, 'created')
    }

    debug(...args) {
        if (this.log) {
            console.debug(...args, this._values)
        }
    }

    register() { }
    unregister() { }

    set(key, value) {
        this.debug('set', key, value);
        this._values[key] = value
    }

    prevent(e) {
        e.preventDefault();
    }

    get(key) {
        return typeof key === 'number' ? this._values[key] : this._values[this._alias[key]];
    }

    alias(name, key) {
        this._alias[name] = key;
        const get = () => this.get(key)
        Object.defineProperty(this, name, { get });
    }
}
