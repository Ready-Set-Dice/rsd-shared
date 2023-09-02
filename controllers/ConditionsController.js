import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'P00', // Error: value is not valid, a string or longer than 0.
}

const CONDITION_PERSISTENT_DAMAGE_TYPES = [
    'Acid', 
    'Bleed', 
    'Bludgeoning', 
    'Chaotic', 
    'Cold', 
    'Electricity', 
    'Evil', 
    'Fire', 
    'Force', 
    'Good', 
    'Lawful', 
    'Mental', 
    'Negative', 
    'Piercing', 
    'Poison', 
    'Positive', 
    'Slashing', 
    'Sonic'
]

const ATTRIBUTE_SKILLS = {
    'dex-based': ['reflex', 'ranged-attack', 'ac', 'acrobatics', 'stealth', 'thievery'],
    'str-based': ['melee-attack', 'athletics'],
    'int-based': ['arcana','crafting','lore','occultism','society'],
    'wis-based': ['medicine','nature','religion','survival'],
    'cha-based': ['deception','diplomacy','intimidation','performance'],
    'con-based': ['fortitude'],
    'hp': ['maxhp'],
    'skill-check': [
        'acrobatics','arcana', 'athletics', 'crafting', 'deception', 'diplomacy', 'intimidation', 
        'lore', 'medicine', 'nature', 'occultism', 'performance', 'religion', 'society',
        'stealth', 'survival', 'thievery'],
    'perception-initiative': ['initiative'],
    'perception': ['initiative'],
    'all': [
        'reflex', 'fortitude', 'will', 'ac', 'melee-attack', 'ranged-attack', 
        'acrobatics','arcana', 'athletics', 'crafting', 'deception', 'diplomacy', 'intimidation', 
        'lore', 'medicine', 'nature', 'occultism', 'performance', 'religion', 'society',
        'stealth', 'survival', 'thievery', 'perception'],
    'prone': ['melee-attack', 'ranged-attack'],
    'speed': ['climbspeed','swimspeed','flyspeed'],
}

const IGNORE_STATS = ['gmid', 'level', 'name', 'partyid', 'useruid']

const EVAL_CHECK = new RegExp('^[0-9\ \*\-]+$')

export class ConditionsController extends DefaultController {
    constructor(isDev) {
        super(isDev)
        
        this._Conditions = [
            {name:'Custom'},
            {name:'Temporary HP'}
        ].concat(this.$store.getters['pf2e/conditions'])
        
        this._setup()
    }

    _setup() {
        this.names = new Array(this._Conditions.length)

        if (!!this._Conditions && this._Conditions.length > 0) {
            this._Conditions.forEach((c,i) => {
                if (!!c && !!c.name) {
                    this.names[i] = c.name.toLowerCase()
                }
            })
        }
    }

    _checkAffectedByModifierGroup(stat, group) {
        // if (group == 'speed') { console.log (stat, group) }
        return stat == group || (!!ATTRIBUTE_SKILLS[group] && ATTRIBUTE_SKILLS[group].includes(stat))
    }

    /* Getters */
    getByType(type) {
        return !!this._Conditions && this.names.includes(type.toLowerCase()) 
        ? Object.values(this._Conditions).find(c => {
            return !!c.name && c.name.toLowerCase() == type.toLowerCase()
        }) 
        : null
    }

    getFieldByType(type, field) {
        let conditionData = this.getByType(type)
        return !!conditionData && (!!conditionData[field] || conditionData[field] == 0) ? conditionData[field] : null
    }

    getConditionDescription(type) {
        let conditionData = this.getByType(type)
        return !!conditionData && !!conditionData.system && !!conditionData.system.description && !!conditionData.system.description.value ? conditionData.system.description.value : null
    }

    getConditionsLinked(type) {
        let conditionData = this.getByType(type)

        if (!!conditionData && !!conditionData.system && !!conditionData.system.rules) {
            let linked = []
            Object.values(conditionData.system.rules).forEach(v => {
                if (!!v && !!v.key && !!v.uuid && v.key == 'GrantItem') {
                    const item = v.uuid.split('.')
                    const conditionName = item[item.length-1]

                    if (!!conditionName) {
                        linked.push(conditionName)
                    }
                }
            })

            return linked
        } else {
            return null
        }

        return !!conditionData && !!conditionData.system && 
               !!conditionData.system.alsoApplies && !!conditionData.system.alsoApplies.linked &&
               Object.keys(conditionData.system.alsoApplies.linked).length > 0
               ? Object.values(conditionData.system.alsoApplies.linked)
               : null
    }
    getConditionsUnlinked(type) {
        let conditionData = this.getByType(type)
        return !!conditionData && !!conditionData.system && 
               !!conditionData.system.alsoApplies && !!conditionData.system.alsoApplies.unlinked &&
               Object.keys(conditionData.system.alsoApplies.unlinked).length > 0
               ? Object.values(conditionData.system.alsoApplies.unlinked)
               : null
    }

    getConditionsLinkedRecursive (type, includeOwn = true) {
        let returnConditions = []
        if (!!includeOwn) {
            const ownid = this.getFieldByType(type, 'name')

            if (!!ownid && !returnConditions.includes(ownid.toLowerCase())) {
                returnConditions.push({type: ownid.toLowerCase()})
            }
        }
        let linkedConditions = this.getConditionsLinked(type)

        if (!!linkedConditions && linkedConditions.length > 0) {
            linkedConditions.forEach(lc => {
                const cid = lc.toLowerCase()

                if (!!cid && !returnConditions.includes(cid)) {
                    returnConditions.push({type: cid, linked: true})
                    
                    let childConditions = this.getConditionsLinkedRecursive(cid, false)
                    if (!!childConditions && childConditions.length > 0) {
                        childConditions.forEach(ccid => {
                            if (!!ccid && !!ccid.type && !returnConditions.find(rc => {rc.type == ccid.type})) {
                                returnConditions.push({...ccid})
                            }
                        })
                    }
                }
            })
        }

        return returnConditions
    }
    getConditionsUnAndLinkedRecursive (type) {
        let returnConditions = []
    
        let linkedConditions = this.getConditionsLinked(type)

        if (!!linkedConditions && linkedConditions.length > 0) {
            linkedConditions.forEach(lc => {
                const cid = lc.toLowerCase()

                if (!!cid && !returnConditions.includes(cid)) {
                    returnConditions.push({type: cid, linked: true})
                    
                    let childConditions = this.getConditionsUnAndLinkedRecursive(cid, false)
                    if (!!childConditions && childConditions.length > 0) {
                        childConditions.forEach(ccid => {
                            if (!!ccid && !!ccid.type && !returnConditions.find(rc => {rc.type == ccid.type})) {
                                returnConditions.push({...ccid})
                            }
                        })
                    }
                }
            })
        }

        let unlinkedConditions = this.getConditionsUnlinked(type)
        if (!!unlinkedConditions && unlinkedConditions.length > 0) {
            unlinkedConditions.forEach(lc => {
                const cid = lc.toLowerCase()

                if (!!cid && !returnConditions.includes(cid)) {
                    returnConditions.push({type: cid})
                    
                    let childConditions = this.getConditionsUnAndLinkedRecursive(cid, false)
                    if (!!childConditions && childConditions.length > 0) {
                        childConditions.forEach(ccid => {
                            if (!!ccid && !!ccid.type && !returnConditions.find(rc => {rc.type == ccid.type})) {
                                returnConditions.push({...ccid})
                            }
                        })
                    }
                }
            })
        }

        return returnConditions
    }

    getAppliedBy(list, type) {
        let appliedBy = []
        if (!!this.getByType(type)) {
            list.forEach(l => {
                if (l.type != type && this.isConditionsLinked(l.type, type)) {
                    appliedBy.push(l.type)
                }
            })
        }
        return appliedBy
    }

    isConditionsLinked(parentType, childType) {
        let linkedConditions = this.getConditionsLinked(parentType)
        if (!!linkedConditions && linkedConditions.length > 0) {
            let foundIndex = linkedConditions.findIndex(lc => { return lc.condition == childType })
            // console.log("m_checkConditionsLinked", parentType, childType, foundIndex, linkedConditions)
            return foundIndex != -1
        } else {
            return false
        }
    }
    isConditionReducing(condition) {
        return !!condition.reduce && (!condition.floor || (!!condition.floor && !!condition.value && condition.value != 1))
    }
    isConditionLocked(condition) {
        return !!condition.floor && !!condition.value && condition.value == 1
    }

    getStatsObject(combatant, stats, conditions, beast) {
        let hazard = false
        let npc = false
        let adv = true

        if (!!combatant && !!combatant.type) {
            if (combatant.type == 'hazard') {
                hazard = true
            } else if (combatant.type == 'npc') {
                npc = true
            } else if (combatant.type == 'pc' && !!beast && !beast.adv) {
                adv = false
            } else if (combatant.type == 'gmc') {
                adv = false
            }
        }

        if (!!stats && !!combatant && !!combatant.type) {
            const level = !npc && !hazard ? Math.max(Number(stats.level), -1) : beast.level
            // console.log(stats)
            let statObject = {}

            let profnolevel = !!this.$rsd.settings.getActiveSettings() && !!this.$rsd.settings.getActiveSettings().profnolevel ? level : 0
            if (!profnolevel) {profnolevel = 0}

            Object.keys(stats).forEach(s => {
                if (s == 'saves' || s == 'scores' || s == 'skills') {
                    let array = null
                    if (s == 'saves')
                        array = this.$rsd.format.saveNames
                    else if (s == 'scores')
                        array = this.$rsd.format.scoreNames
                    else if (s == 'skills')
                        array = this.$rsd.format.skillNames
                    
                    if (!!array) {
                        array.forEach((f,i) => {
                            let val = stats[s][i]

                            // Since perception & saving throws are the proficiency level and base on level
                            if (s != 'scores' && !hazard && (!npc || !!npc && val == 0)) {
                                const score_name = s == 'saves' ? this.$rsd.format.saveScore(f) : this.$rsd.format.skillScore(f)
                                let score = 0
                                if (s == 'saves') {
                                    score = !npc ? stats.scores[this.$rsd.format.scoreIndexes[score_name]]
                                    : (!!beast && !!beast.core && !!beast.core[this.$rsd.format.saveScoreShort(f)] ? beast.core[this.$rsd.format.saveScoreShort(f)].mod : 0)
                                    
                                    // val = !!adv ? this.$rsd.format.getSaveModifier(score, level, val) : val
                                    if (!!adv && score != 0 && (!npc || !!npc && score != val)) { val -= profnolevel }
                                } else if (s == 'skills') {
                                    score = !npc ? stats.scores[this.$rsd.format.scoreIndexes[score_name]]
                                    : (!!beast && !!beast.core && !!beast.core[this.$rsd.format.skillScoreShort(f)] ? beast.core[this.$rsd.format.skillScoreShort(f)].mod : 0)                  

                                    // val = !!adv ? this.$rsd.format.getSkillModifier(score, level, val) : val

                                    if (!!adv && score != 0 && (!npc || !!npc && score != val)) { val -= profnolevel }
                                }
                            } else if (!!npc && val != 0) {
                                let score = 0
                                if (s == 'saves') {
                                    score = !!beast && !!beast.core && !!beast.core[this.$rsd.format.saveScoreShort(f)] ? beast.core[this.$rsd.format.saveScoreShort(f)].mod : 0

                                    if (!!adv && score != 0 && (!npc || !!npc && score != val)) { val -= profnolevel }
                                } else if (s == 'skills') {
                                    score = !!beast && !!beast.core && !!beast.core[this.$rsd.format.skillScoreShort(f)] ? beast.core[this.$rsd.format.skillScoreShort(f)].mod : 0                 

                                    if (!!adv && score != 0 && (!npc || !!npc && score != val)) { val -= profnolevel }
                                }
                            } else if (!!hazard && !!beast) {
                                if (f == 'stealth' && !!beast && !!beast.stealth) {
                                    val = beast.stealth
                                }
                                
                                if ((f == 'stealth' || f == 'fortitude' || f == 'reflex') && val != null) {
                                    val -= profnolevel
                                }
                                // console.log('hazard', f, val, profnolevel, beast)
                            }

                            statObject[f] = {
                                base: val,
                                value: val,
                                modified: false,
                                bonus: {
                                    circumstance: {
                                        effect: '', value: 0
                                    },
                                    status: {
                                        effect: '', value: 0
                                    },
                                    untyped: []
                                },
                                penalty: {
                                    circumstance: {
                                        effect: '', value: 0
                                    },
                                    status: {
                                        effect: '', value: 0
                                    },
                                    untyped: []
                                }
                            }
                        })
                    }
                } else if (s == 'otherspeed') {
                    Object.keys(stats[s]).forEach((f,i) => {
                        let val = stats[s][f]

                        statObject[f+'speed'] = {
                            base: val,
                            value: val,
                            modified: false,
                            bonus: {
                                circumstance: {
                                    effect: '', value: 0
                                },
                                status: {
                                    effect: '', value: 0
                                },
                                untyped: []
                            },
                            penalty: {
                                circumstance: {
                                    effect: '', value: 0
                                },
                                status: {
                                    effect: '', value: 0
                                },
                                untyped: []
                            }
                        }
                    })

                    // console.log(statObject)
                } else if (!IGNORE_STATS.includes(s)) {
                    let val = stats[s]

                    // Since perception & saving throws are the proficiency level and base on level
                    if (s == 'perception' && !hazard && (!npc || !!npc && val == 0)) {
                        const score_name = this.$rsd.format.saveScore(s)

                        const score = !npc ? stats.scores[this.$rsd.format.scoreIndexes[score_name]]
                        : (!!beast && !!beast.core && !!beast.core[this.$rsd.format.saveScoreShort(s)] ? beast.core[this.$rsd.format.saveScoreShort(s)].mod : 0)

                        // val = !!adv ? this.$rsd.format.getSaveModifier(score, level, val) : val
                        
                        if (!!adv && score != 0 && (!npc || !!npc && score != val)) { val -= profnolevel }
                    } else if (s == 'perception' && !!npc && val != 0) {
                        const score = !!beast && !!beast.core && !!beast.core[this.$rsd.format.saveScoreShort(s)] ? beast.core[this.$rsd.format.saveScoreShort(s)].mod : 0

                        if (!!adv && score != 0 && (!npc || !!npc && score != val)) { val -= profnolevel }
                    } else if (s == 'ac' && val != null) {
                        val -= profnolevel
                    }

                    statObject[s] = {
                        base: val,
                        value: val,
                        modified: false,
                        bonus: {
                            circumstance: {
                                effect: '', value: 0
                            },
                            status: {
                                effect: '', value: 0
                            },
                            untyped: []
                        },
                        penalty: {
                            circumstance: {
                                effect: '', value: 0
                            },
                            status: {
                                effect: '', value: 0
                            },
                            untyped: []
                        }
                    }
                }
            })

            delete statObject.saves
            delete statObject.scores
            delete statObject.skills

            if (!!conditions) {
                Object.keys(statObject).forEach(s => {
                    conditions.forEach(c => {
                        statObject[s] = {...this._getModifiedStatObject(level, c, s, {...statObject[s]})}
                    })
                })
            }

            // if (combatant.name.toLowerCase() == 'stink-sap trap') {
            //     console.log(`${combatant.name} stats`, combatant, statObject, beast)
            // }

            return statObject
        } else {
            return null
        }
    }

    _getModifiedStatObject(level, condition, stat, statObject) {
        let conditionData = this.getByType(condition.type)
        if (!!conditionData && !!conditionData.system && !!conditionData.system.rules && conditionData.system.rules.length > 0) {
            conditionData.system.rules.forEach(m => {
                // console.log("hi", id, stat, statObject)

                // If this condition affects a flat modifier
                if (m.key == "FlatModifier") {
                    // Check if the condition affacts the current stat
                    if (this._checkAffectedByModifierGroup(stat, m.selector)) {
                        // console.log('hi', stat, m.selector)
                        let newValue = !isNaN(Number(m.value)) 
                        ? Number(m.value) 
                        : (
                            this.processConditionValueRule(level, condition, m)
                        )

                        if (m.type == 'status' || m.type == 'circumstance') {
                            let oldValue = statObject.penalty[m.type].value
                            if (statObject.penalty[m.type].value >= newValue) {
                                statObject.penalty[m.type] = {
                                    effect: condition.name || condition.type,
                                    value: newValue
                                }

                                statObject.value = statObject.value - oldValue + newValue
                                statObject.modified = true
                            }
                        } else {
                            statObject.penalty['untyped'].push({
                                effect: condition.name || condition.type,
                                value: newValue
                            })
                            statObject.value = statObject.value + newValue
                            statObject.modified = true
                        }

                        if (stat == 'speed' || stat == 'climbspeed' || stat == 'swimspeed' || stat == 'flyspeed') {
                            if (statObject.base == 0) {
                                statObject.value = 0
                                statObject.modified = false
                            } else {
                                statObject.value = Math.max(statObject.value, 5)
                            }
                        }
                    }
                }
            })

            return statObject
        } else {
            return statObject
        }
    }

    processConditionValueRule(level, condition, rule) {
        let returnValue = 0
        
        let levelValue = Math.max(Number(level), 1)
        let conditionValue = Number(condition.value)
        if (typeof(levelValue) == 'number' && typeof(conditionValue) == 'number') {
            let ruleValue = rule.value.replaceAll('@item.badge.value', conditionValue).replaceAll('@actor.level', levelValue)
            if (!!EVAL_CHECK.test(ruleValue)) {
                returnValue = eval(ruleValue)
            }
        }

        return returnValue
    }

    hasDuration(ctype) {
        const type = ctype.toLowerCase()
        if (type == 'custom' || type == 'frightened' || type == 'blinded' || type == 'clumsy' ||
            type == 'concealed' || type == 'confused' || type == 'controlled' || type == 'dazzled' ||
            type == 'deafened' || type == 'drained' || type == 'encumbered' || type == 'enfeebled' ||
            type == 'fascinated' || type == 'off-guard' || type == 'fleeing' || type == 'friendly' ||
            type == 'grabbed' || type == 'helpful' || type == 'hidden' || type == 'immobilized' ||
            type == 'indifferent' || type == 'invisible' || type == 'paralyzed' || type == 'persistent damage' ||
            type == 'quickened' || type == 'sickened' || type == 'slowed' || type == 'stunned' ||
            type == 'stupefied' || type == 'unconscious' || type == 'undetected' || type == 'unfriendly' ||
            type == 'hostile' || type == 'unnoticed') {
            return true
        } else {
            return false
        }
    }

    hasValue(ctype) {
        const type = ctype.toLowerCase()
        if (type == 'custom') {
            return true
        } else if (type == 'temporary hp') {
            return false
        } else {
            let data = this.getByType(type)
            return !!data && !!data.system && !!data.system.value && !!data.system.value.isValued
        }
    }

    isPersistentDamage(ctype) {
        return !!ctype && ctype.toLowerCase() == 'persistent damage'
    }


    /* Setters */

    /* Functions */
}