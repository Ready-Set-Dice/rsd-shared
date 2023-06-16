import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'F00', // Error: value is not valid, a string or longer than 0.
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const whiteListRegex = /[^0-9d+-]/g
const diceRegex = /(([0-9]+)d([0-9]+))/g

export class RandomController extends DefaultController {
    constructor(isDev) {
        super(isDev)

    }

    getDiceRoll(damageObject) {
        let result = {
            total: 0,
            types: {}
        }

        if (!!damageObject && Object.keys(damageObject).length > 0) {
            Object.values(damageObject).forEach(d => {
                if (!!d.damage && !!d.damageType) {
                    result.types[d.damageType] = {
                        total: 0,
                        parts: [],
                    }

                    const safestring = d.damage.replaceAll(whiteListRegex, '')
                    const split = safestring.split(/[\+]/g)

                    split.forEach(comp => {
                        if (!!comp.includes('d')) { // A dice roll
                            const dicesplit = comp.split('d')
                            const diceNumber = Number(dicesplit[0])
                            const diceFace = Number(dicesplit[1])
                            for(let i=0; i<diceNumber; i+=1) {
                                const diceResult = Math.floor(Math.random() * diceFace + 1)
                                let partResult = {
                                    value: diceResult,
                                    roll: true,
                                }
                                if (diceResult == 1) {
                                    partResult.critfail = true
                                } else if (diceResult == diceFace) {
                                    partResult.critsuccess = true
                                }

                                result.total += diceResult
                                result.types[d.damageType].total += diceResult
                                result.types[d.damageType].parts.push(partResult)
                            }
                        } else { // A constant
                            const constantResult = Number(eval(comp))
                            let partResult = {
                                value: constantResult,
                            }

                            result.total += constantResult
                            result.types[d.damageType].total += constantResult
                            result.types[d.damageType].parts.push(partResult)
                        }
                    })
                }
            })
        }

        return result
    }

    getInitiativeRoll(mod) {
        return this.getDiceRollNumberWithMod(20, 1, mod)
    }

    getDiceRollNumberWithMod(faces, num, mod) {
        let m_roll = 0;
        for (let i=0; i<num; i++) {
            m_roll += this.getDiceRollWithFaces(faces)
        }
        return m_roll + mod
    }
    getDiceRollWithFaces(faces) {
        return Math.floor(Math.random() * faces + 1)
    }
    getRandomUID(length) {
        var result           = '';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(
                        Math.floor(Math.random() * 
                        charactersLength)
                    );
        }
        return result;
    }
    getRandomColor() {
        let rRand = Math.floor(Math.random() * 255 + 1)
        let gRand = Math.floor(Math.random() * 255 + 1)
        let bRand = Math.floor(Math.random() * 255 + 1)
        let aRand = Math.random()

        return {r: rRand, b: gRand, g:bRand, a: aRand}
    }
}