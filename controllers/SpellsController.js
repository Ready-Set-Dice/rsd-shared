import { SpellService, isGM  } from '@/services'
import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'P00', // Error: value is not valid, a string or longer than 0.
}

export class SpellsController extends DefaultController {
    constructor(isDev) {
        super(isDev)

        this._Spells = []

        SpellService.on('Set', () => { this._update() })
        SpellService.on('EffectsSet', () => { this._update() })
        SpellService.on('NamePairSet', () => { this._update() })
    }

    get(sid) {
        return !!sid && !!this._Spells && this._Spells.length > 0 ? this._Spells.find(spell => {
            return spell._id == sid
        }) : null
    }

    all() {
        return this._Spells
    }

    _update() {
        this._Spells = SpellService.getSpells()
        this.emit('Update')
    }
}