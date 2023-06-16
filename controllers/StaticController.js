import { StaticService, isGM  } from '@/services'
import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'S00', // Error: value is not valid, a string or longer than 0.
}

export class StaticController extends DefaultController {
    constructor(isDev) {
        super(isDev)

    }

    getTraitDescription(trait) {
        return StaticService.getTraitDescription(trait)
    }
}