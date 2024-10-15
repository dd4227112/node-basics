import { EventEmitter } from 'node:events';

export class User extends EventEmitter { // class name shoule start with capital letter, dont use () when extending a class
    constructor() { 
        super(); // call the constructor of the base class using super function
    }
}

