const EventEmitter = require('events')
import { set, get } from 'idb-keyval';

class FeatService extends EventEmitter {
    constructor() {
        super()
    }

    init(store) {
        // console.log("Init FeatService")
        this.$store = store

        this.load()
    }

    reset() {
        this.array = []
    }

    load() {
        this.reset()
        get('feats').then(val => {
            if (val) {
                this.array = val

                this.emit('Set')
            }
        })
    }

    getFeats() {
        return this.array
    }

    getFeat(id) {
        let found = null

        if (this.array) {
            found = this.array.find(b => {
                return b._id == id
            })
        }

        return found
    }

    getAncestryFeats(traits, level) {
        let found = []

        if (this.array) {
            found = this.array.filter(b => {
                let hasTrait = false
                traits.forEach(t => {
                    hasTrait = hasTrait || b.system.traits.value.includes(t)
                })
                return (hasTrait && b.system.featType.value == "ancestry" && b.system.level.value <= level)
            })
        }

        return found
    }

    getClassFeats(className) {
        let found = []

        if (this.array) {
            found = this.array.filter(b => {
                // Apparently these exist:
                // if (b.system.traits.value.length == 0) {
                //     console.log(b.name)
                // }
                return (b.system.traits.value.includes(className.toLowerCase()) && b.system.featType.value == "class")
            })
        }

        return found
    }

    getGeneralFeats(level) {
        let found = []

        if (this.array) {
            found = this.array.filter(b => {
                return ((b.system.featType.value == "skill" || b.system.featType.value == "general") && b.system.level.value <= level)
            })
        }

        return found
    }

    getSkillFeats(level) {
        let found = []

        if (this.array) {
            found = this.array.filter(b => {
                return (b.system.featType.value == "skill" && b.system.level.value <= level)
            })
        }

        return found
    }

    // getClassFeats(className, level) {
    //     let found = []

    //     if (this.array) {
    //         found = this.array.filter(b => {
    //             // Apparently these exist:
    //             // if (b.system.traits.value.length == 0) {
    //             //     console.log(b.name)
    //             // }
    //             return (b.system.traits.value.includes(className.toLowerCase()) && b.system.featType.value == "class" && b.system.level.value <= level)
    //         })
    //     }

    //     return found
    // }
    
}

export default new FeatService();