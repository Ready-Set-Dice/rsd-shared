const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export default {
    data() {
        return {
            // External
            Random: {
                dice: {
                    initiative: (mod) => {
                        return this.m_DiceRollNumberWithMod(20, 1, mod)
                    },
                    roll: (faces, num, mod) => {
                        return this.m_DiceRollNumberWithMod(faces, num, mod)
                    },
                },
                uid: {
                    length: (length) => { return !!length ? this.m_RandomUID(length) : null },
                    default: () => { return this.m_RandomUID(20); }
                },
                color: () => {
                    return this.m_RandomColor()
                }
            },
        }
    },
    computed: {
    },
    methods: {
        m_DiceRollNumberWithMod(faces, num, mod) {
            let m_roll = 0;
            for (let i=0; i<num; i++) {
                m_roll += this.m_DiceRollWithFaces(faces)
            }
            return m_roll + mod
        },
        m_DiceRollWithFaces(faces) {
            return Math.floor(Math.random() * faces + 1)
        },
        m_RandomUID(length) {
            var result           = '';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(
                            Math.floor(Math.random() * 
                            charactersLength)
                        );
            }
            return result;
        },
        m_RandomColor() {
            let rRand = Math.floor(Math.random() * 255 + 1)
            let gRand = Math.floor(Math.random() * 255 + 1)
            let bRand = Math.floor(Math.random() * 255 + 1)
            let aRand = Math.random()

            return {r: rRand, b: gRand, g:bRand, a: aRand}
        }
    }
}