import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'H00', // Error: X
}

export class EventHistoryController extends DefaultController {
    constructor(isDev) {
        super(isDev)

        this._Events = this.$store.getters['rsd/eventhistory']
    }

    get() {
        return this._Events
    }

    push(data) {
        this.$store.dispatch('rsd/pushEventHistory', data)

        this.emit('Update')
    }
}