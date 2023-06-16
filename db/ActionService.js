const EventEmitter = require('events')
import { set, get } from 'idb-keyval';

class ActionService extends EventEmitter {
    constructor() {
        super()
    }

    init(store) {
        // console.log("Init ActionService")
        this.$store = store

        this.load()
    }

    reset() {
        this.array = []
    }

    load() {
        this.reset()
        get('actions').then(val => {
            if (val) {
                this.array = val

                this.emit('Set')
            }
        })
    }

    getActions() {
        return this.array
    }

    getAction(id) {
        let found = null

        if (this.array) {
            found = this.array.find(b => {
                return b._id == id
            })
        }

        return found
    }
    
}

export default new ActionService();