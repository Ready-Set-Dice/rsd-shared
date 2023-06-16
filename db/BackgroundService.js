const EventEmitter = require('events')
import { set, get } from 'idb-keyval';

class BackgroundService extends EventEmitter {
    constructor() {
        super()
    }

    init(store) {
        // console.log("Init BackgroundService")
        this.$store = store

        this.load()
    }

    reset() {
        this.array = []
    }

    load() {
        this.reset()
        get('backgrounds').then(val => {
            if (val) {
                this.array = val

                this.emit('Set')
            }
        })
    }

    getBackgrounds() {
        return this.array
    }

    getBackground(id) {
        let found = null

        if (this.array) {
            found = this.array.find(b => {
                return b._id == id
            })
        }

        return found
    }
    
}

export default new BackgroundService();