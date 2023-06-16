const EventEmitter = require('events')
import { set, get } from 'idb-keyval';

class ArcheTypeService extends EventEmitter {
    constructor() {
        super()
    }

    init(store) {
        // console.log("Init ArcheTypeService")
        this.$store = store

        this.load()
    }

    reset() {
        this.array = []
    }

    load() {
        this.reset()
        get('archetypes').then(val => {
            if (val) {
                this.array = val

                this.emit('Set')
            }
        })
    }

    getArchetypes() {
        return this.array
    }

    getArchetype(id) {
        let found = null

        if (this.array) {
            found = this.array.find(b => {
                return b._id == id
            })
        }

        return found
    }
    
}

export default new ArcheTypeService();