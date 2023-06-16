const EventEmitter = require('events')
import { set, get } from 'idb-keyval';

class StaticService extends EventEmitter {
    constructor() {
        super()
    }

    init(store) {
        // console.log("Init SpellService")
        this.$store = store
    }

    reset() {
        this.en = null
        this.re_en = null
    }

    resetEffects() {
        this.effects = []
    }

    load() {
        this.reset()
        get('en.json').then(val => {
            if (!!val) {
                this.en = val

                this.emit('Set')
            }
        })
        get('re-en.json').then(val => {
            if (!!val) {
                this.re_en = val

                this.emit('Set')
            }
        })
    }

    getEN() {
        return this.en
    }

    getRE_EN() {
        return this.re_en
    }

    getTraitDescription(trait) {
        let node = 'TraitDescription' + trait
        return !!trait && !!this.en && !!this.en['PF2E'] && !!this.en['PF2E'][node] ? this.en['PF2E'][node] : null
    }
    
}

export default new StaticService();