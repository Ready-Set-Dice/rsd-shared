import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'Q00', // Error: X
}

export class BottomSheetController extends DefaultController {
    constructor(isDev) {
        super(isDev)
    }

    open(data) {
        if (!!data) {
            this.$store.dispatch('rsd/setBottomSheet', {
                name: data,
                uid: this.$rsd.random.getRandomUID(20),
            })
        }
    }
}