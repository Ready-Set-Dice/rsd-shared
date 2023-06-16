const EventEmitter = require('events')
import { set, get } from 'idb-keyval';

class HeritageService extends EventEmitter {
    constructor() {
        super()
    }

    init(store) {
        this.$store = store

        this.load()
    }

    reset() {
        this.array = []
    }

    load() {
        this.reset()
        get('heritages').then(val => {
            if (val) {
                this.array = val

                this.emit('Set')
            }
        })
    }

    getHeritages() {
        return this.array
    }

    getHeritage(id) {
        let found = null

        if (this.array) {
            found = this.array.find(b => {
                return b._id == id
            })
        }

        return found
    }
    
}

export default new HeritageService();