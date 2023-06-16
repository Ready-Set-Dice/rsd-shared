export default {
    data() {
        return {
            // External
            DB: {
                stats: {
                    toFlat: (stats) => {
                        return !!stats ? this.m_convertStatObjectToFlat(stats) : null
                    },
                    toObject: (stats) => {
                        return !!stats ? this.m_convertStatFlatToObject(stats) : null
                    },
                },
                skills: {
                    get: {
                        names: () => {
                            return SKILLS_NAMES
                        },
                        indexes: () => {
                            return SKILLS_INDEX
                        },
                        score: (name) => {
                            return SKILLS_ABILITY_SCORE[name]
                        },
                        scoreShort: (name) => {
                            return SKILLS_ABILITY_SCORE[name].substr(0,3)
                        },
                    },
                },
                scores: {
                    get: {
                        names: () => {
                            return ABILITY_SCORE_NAMES
                        },
                        indexes: () => {
                            return ABILITY_SCORE_INDEX
                        },
                    },
                },
                saves: {
                    get: {
                        names: () => {
                            return SAVES_NAMES
                        },
                        indexes: () => {
                            return SAVES_INDEX
                        },
                        score: (name) => {
                            return SAVES_ABILITY_SCORE[name]
                        },
                        scoreShort: (name) => {
                            return SAVES_ABILITY_SCORE[name].substr(0,3)
                        },
                    },
                }
            },
        }
    },
    methods: {
        m_convertStatObjectToFlat(stats) {
            let newStats = {...stats}
            newStats.fortitude = !!newStats.saves ? newStats.saves[0] : 0
            newStats.reflex = !!newStats.saves ? newStats.saves[1] : 0
            newStats.will = !!newStats.saves ? newStats.saves[2] : 0
            delete newStats.saves

            newStats.strength = !!newStats.scores ? newStats.scores[0] : 10
            newStats.dexterity = !!newStats.scores ? newStats.scores[1] : 10
            newStats.constitution = !!newStats.scores ? newStats.scores[2] : 10
            newStats.intelligence = !!newStats.scores ? newStats.scores[3] : 10
            newStats.wisdom = !!newStats.scores ? newStats.scores[4] : 10
            newStats.charisma = !!newStats.scores ? newStats.scores[5] : 10
            delete newStats.scores

            newStats.acrobatics = !!newStats.skills ? newStats.skills[0] : 0
            newStats.arcana = !!newStats.skills ? newStats.skills[1] : 0
            newStats.athletics = !!newStats.skills ? newStats.skills[2] : 0
            newStats.crafting = !!newStats.skills ? newStats.skills[3] : 0
            newStats.deception = !!newStats.skills ? newStats.skills[4] : 0
            newStats.diplomacy = !!newStats.skills ? newStats.skills[5] : 0
            newStats.intimidation = !!newStats.skills ? newStats.skills[6] : 0
            newStats.lore = !!newStats.skills ? newStats.skills[7] : 0
            newStats.medicine = !!newStats.skills ? newStats.skills[8] : 0
            newStats.nature = !!newStats.skills ? newStats.skills[9] : 0
            newStats.occultism = !!newStats.skills ? newStats.skills[10] : 0
            newStats.performance = !!newStats.skills ? newStats.skills[11] : 0
            newStats.religion = !!newStats.skills ? newStats.skills[12] : 0
            newStats.society = !!newStats.skills ? newStats.skills[13] : 0
            newStats.stealth = !!newStats.skills ? newStats.skills[14] : 0
            newStats.survival = !!newStats.skills ? newStats.skills[15] : 0
            newStats.thievery = !!newStats.skills ? newStats.skills[16] : 0
            delete newStats.skills

            newStats.level = newStats.level || 1

            return newStats
        },

        m_convertStatFlatToObject(stats) {
            let newStats = {...stats}
            newStats.saves = [newStats.fortitude, newStats.reflex, newStats.will]
            delete newStats.fortitude
            delete newStats.reflex
            delete newStats.will

            newStats.scores = [
                newStats.strength || 10,
                newStats.dexterity || 10,
                newStats.constitution || 10,
                newStats.intelligence || 10,
                newStats.wisdom || 10,
                newStats.charisma || 10
            ]
            delete newStats.strength
            delete newStats.dexterity
            delete newStats.constitution
            delete newStats.intelligence
            delete newStats.wisdom
            delete newStats.charisma

            newStats.skills = [
                newStats.acrobatics || 0,
                newStats.arcana || 0,
                newStats.athletics || 0,
                newStats.crafting || 0,
                newStats.deception || 0,
                newStats.diplomacy || 0,
                newStats.intimidation || 0,
                newStats.lore || 0,
                newStats.medicine || 0,
                newStats.nature || 0,
                newStats.occultism || 0,
                newStats.performance || 0,
                newStats.religion || 0,
                newStats.society || 0,
                newStats.stealth || 0,
                newStats.survival || 0,
                newStats.thievery || 0,
            ]
            delete newStats.acrobatics
            delete newStats.arcana
            delete newStats.athletics
            delete newStats.crafting
            delete newStats.deception
            delete newStats.diplomacy
            delete newStats.intimidation
            delete newStats.lore
            delete newStats.medicine
            delete newStats.nature
            delete newStats.occultism
            delete newStats.performance
            delete newStats.religion
            delete newStats.society
            delete newStats.stealth
            delete newStats.survival
            delete newStats.thievery

            return newStats
        },
    }
}

const ABILITY_SCORE_INDEX = {
    'strength': 0,
    'dexterity': 1,
    'constitution': 2,
    'intelligence': 3,
    'wisdom': 4,
    'charisma': 5,
}
const ABILITY_SCORE_NAMES = [
    'strength','dexterity','constitution','intelligence','wisdom','charisma'
]
const SAVES_INDEX = {
    'fortitude': 0,
    'reflex': 1,
    'will': 2,
}
const SAVES_NAMES = [
    'fortitude','reflex','will'
]
const SAVES_ABILITY_SCORE = {
    'perception': 'wisdom',
    'fortitude': 'constitution',
    'reflex': 'dexterity',
    'will': 'wisdom',
}
const SKILLS_INDEX = {
    'acrobatics': 0,
    'arcana': 1,
    'athletics': 2,
    'crafting': 3,
    'deception': 4,
    'diplomacy': 5,
    'intimidation': 6,
    'lore': 7,
    'medicine': 8,
    'nature': 9,
    'occultism': 10,
    'performance': 11,
    'religion': 12,
    'society': 13,
    'stealth': 14,
    'survival': 15,
    'thievery': 16,
}
const SKILLS_NAMES = [
    'acrobatics','arcana','athletics','crafting','deception','diplomacy','intimidation','lore','medicine','nature','occultism','performance','religion','society','stealth','survival','thievery',
]
const SKILLS_ABILITY_SCORE = {
    'acrobatics': 'dexterity',
    'arcana': 'intelligence',
    'athletics': 'strength',
    'crafting': 'intelligence',
    'deception': 'charisma',
    'diplomacy': 'charisma',
    'intimidation': 'charisma',
    'lore': 'intelligence',
    'medicine': 'wisdom',
    'nature': 'wisdom',
    'occultism': 'intelligence',
    'performance': 'charisma',
    'religion': 'wisdom',
    'society': 'intelligence',
    'stealth': 'dexterity',
    'survival': 'wisdom',
    'thievery': 'dexterity',
}