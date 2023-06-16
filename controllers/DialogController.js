import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'D00', // Error: X
}

export class DialogController extends DefaultController {
    constructor(isDev) {
        super(isDev)
    }

    open(data) {
        if (!!data && !!data.name && !!data.attrs) {
            this.$store.dispatch('rsd/setDialog', {
                name: data.name,
                uid: this.$rsd.random.getRandomUID(20),
                attrs: data.attrs
            })
        }
    }
}