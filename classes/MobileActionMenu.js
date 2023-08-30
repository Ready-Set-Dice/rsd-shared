const EventEmitter = require('events')
import store from '@root/.shared/store/store'
import { $rsd } from '@/plugins/RSDPlugin'

export class MobileActionMenu extends EventEmitter {
    constructor() {
        super()
        this.$store = store
        this.$rsd = $rsd
    }

    getKeys(members) {
        let keys = []

        if (!!members && members.length > 0) {
            members.forEach(m => {
                if (!!m && !!m.id) {
                    keys.push(m.id)
                }
            })
        }

        return keys
    }

    getMembersCount(members) {
        let count = 0

        if (!!members) {
            Object.values(members).forEach(o => {if (!!o) {count+=1}})
        }

        return count
    }

    getCombatantsArray() {
        return this.$rsd.combat.getCombatantsArray()
    }
    getMobileView() {
        return this.$store.getters['rsd/mobileView']
    }

    getAll(keys, array) {
        let values = []

        Object.keys(keys).forEach(o => {
            if (!!keys[o]) {
                const index = this.getIndex(keys[o], array)
                if (!!index || index == 0) {
                    values.push(array[index])
                }
            }
        })

        if (!!values && values.length > 0 ) {
            return values
        } else {
            return null
        }
    }

    getIndex(id, array) {
        if (typeof(id) == 'number') {
            const cid = !!array && id < array.length ? array[id] : null
            if (!!cid) {
                return id
            } else {
                return null
            }
        } else if (typeof(id) == 'string') {
            if (!!id && !!array && array.length > 0) {
                const index = array.findIndex(a => a.id == id)
                const cid = index != -1 ? array[index] : null
                if (!!cid) {
                    return index
                } else {
                    return null
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }
}