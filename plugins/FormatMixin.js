export default {
    data() {
        return {
            // External
            Format: {
                arrayToString: (array) => {
                    return !!array && array.length > 0 ? this.m_FormatArrayToString(array) : null
                },
                capitalize: (item) => {
                    return  !!item && item.length > 0 ? this.m_FormatCapitalize(item) : null
                },
                sizeBeautify: (size) => {
                    return !!size ? this.m_FormatSizeBeautify(size) : null
                },
                rarityColor: (trait) => {
                    return !!trait ? this.m_FormatRarityColor(trait) : null
                },
                numberArray: (start, end, step) => {
                    return this.m_FormatNumberArray(start, end, step)
                },
                numberValueTextArray: (start, end, step) => {
                    return this.m_FormatValueTextArray(start, end, step)
                }
            },
        }
    },
    computed: {
    },
    methods: {
        m_FormatArrayToString(array) {
            let singleLine = ""

            array.forEach((a) => {
                singleLine += (a.charAt(0).toUpperCase() + a.slice(1)) + ", "
            })

            singleLine = singleLine.substring(0, singleLine.length-2)

            return singleLine
        },

        m_FormatCapitalize(item) {
            return item.charAt(0).toUpperCase() + item.slice(1)
        },

        m_FormatSizeBeautify(size) {
            switch(size) {
                case 'tiny':
                    return 'Tiny'
                case 'sm':
                    return 'Small'
                case 'med':
                    return 'Medium'
                case 'lg':
                    return 'Large'
                case 'huge':
                    return 'Huge'
                case 'grg':
                    return 'Gargantuan'
            }
        },

        m_FormatRarityColor(trait) {
            if (trait == 'uncommon') {
                return "uncommon lighten-1 white--text"
            } else if (trait == 'rare') {
                return "rare lighten-1 white--text"
            } else if (trait == 'unique') {
                return "unique lighten-1 white--text"
            } else {
                return "main lighten-1 white--text"
            }
        },

        m_FormatNumberArray(start, end, step = 1) {
            let numArray = new Array((end-start) / step)
            let index = 0
            for(let i=start; i<=end; i=i+step) {
                numArray[index] = i
                index = index+1
            }
            return numArray
        },

        m_FormatValueTextArray(start, end, step = 1) {
            let numArray = new Array((end-start) / step)
            let index = 0
            for(let i=start; i<=end; i=i+step) {
                numArray[index] = {value: i, text: i}
                index = index+1
            }
            return numArray
        },
    }
}