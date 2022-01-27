"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor(event, client, name) {
        this.exec = event.default;
        this.name = name;
        this.Client = client;
    }
    run() {
        return this.exec.bind(null, this.Client);
    }
}
exports.Event = Event;
