const EventEmitter = require('events')
import { set, get } from 'idb-keyval';

class DeityService extends EventEmitter {
    constructor() {
        super()
    }

    init(store) {
        this.$store = store

        this.load()
    }

    reset() {
        this.deities = []
        this.domains = []
    }

    load() {
        this.reset()
        get('deities').then(val => {
            if (val) {
                this.deities = val

                this.emit('Set')
            }
        })
        get('domains').then(val => {
            if (val) {
                this.domains = val

                this.emit('Set')
            }
        })
    }

    getDeities() {
        return this.deities
    }

    getDeityDomains() {
        return this.domains
    }

    getDeity(id) {
        let found = null

        if (this.deities) {
            found = this.deities.find(b => {
                return b._id == id
            })
        }

        return found
    }
    
}

export default new DeityService();