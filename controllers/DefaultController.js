const EventEmitter = require('events')
import store from '@/../../.shared/store/store'

export class DefaultController extends EventEmitter {
    constructor(isDev) {
        super()
        this.$store = store
        this.DEV = isDev
    }

    includesKey(array, key) {
        let included = false
        array.every(element => {
            const keys = Object.keys(element)
            if (keys.includes(key)) {
                included = true
                return false
            }
            return true
        });
        return included
    }
    
    setFB(fb) {
        this.$rsd = fb
    }

    log(msg) {
        if (!!this.DEV) {
            console.log(msg)
        }
    }

    error(errcode, msg) {
        if (!!this.DEV) {
            console.error(errcode, msg)
        } else {
            console.error(`Error code [${errcode}], please report in discord.`)
        }
    }

    warn(errcode, msg) {
        if (!!this.DEV) {
            console.warn(errcode, msg)
        } else {
            console.warn(`Warning code [${errcode}], please report in discord.`)
        }
    }
}