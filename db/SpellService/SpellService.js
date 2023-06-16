const EventEmitter = require('events')
import { set, get } from 'idb-keyval';
import SpellParser from './SpellServiceParsing'

class SpellService extends EventEmitter {
    constructor() {
        super()
    }

    init(store, StaticService) {
        // console.log("Init SpellService")
        this.$store = store

        this.StaticService = StaticService
        SpellParser.init(StaticService)
    }

    resetSpells() {
        this.spells = []
        this.namePair = []
    }

    resetEffects() {
        this.effects = []
    }

    loadSpells() {
        this.resetSpells()
        get('spells').then(val => {
            if (val) {
                this.spells = val

                this.emit('Set')
                this.loadNamePair()
            }
        })
    }

    loadEffects() {
        this.resetEffects()
        get('spell_effects').then(val => {
            if (val) {
                this.effects = val

                this.emit('EffectsSet')
            }
        })
    }

    loadNamePair() {
        let count = 0
        this.spells.forEach(b => {
            let pair = {
                name: b.name,
                id: b._id,
                type: 'spell',
            }
            this.namePair.push(pair)

            count += 1

            if (count == this.spells.length) {
                this.emit('NamePairSet')
            }
        })
    }

    getSpells() {
        return this.spells
    }

    getEffects() {
        return this.effects
    }

    getNamePair() {
        return this.namePair
    }

    getSpell(id) {
        let found = null

        if (this.spells) {
            found = this.spells.find(b => {
                return b._id == id
            })
        }

        return found
    }

    getSpellByName(name) {
        let found = null

        if (this.spells) {
            found = this.spells.find(b => {
                return b.name.toLowerCase() == name.toLowerCase()
            })
        }

        return found
    }
    
    getEffect(id) {
        let found = null

        if (this.effects) {
            found = this.effects.find(b => {
                return b._id == id
            })
        }

        return found
    }

    parseSpell(spell) {
        return SpellParser.parseSpell(spell)
    }
    
}

export default new SpellService();