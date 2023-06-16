import { AncestryService, BackgroundService, ClassService, DeityService, FeatService, HeritageService, isGM} from '@/services'
import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'V00', // Error: Generic error.
    1: 'V01', // Error: Array is empty
    2: 'V02', // Error: key ${key} is not a string
    3: 'V03', // Error: key ${key} is not in array
}

const ID_EXCEPTIONS = ['gblTFUOgolqFS9v4']
const NAME_EXCEPTIONS = ['Devine Font']

export class BuildController extends DefaultController {
    constructor(isDev) {
        super(isDev)
    }

    _getPair(array, extra = null) {
        let pair = []

        if (!!array && array.length > 0) {
            array.forEach(item => {
                const newItem = {text: item.name, value: item._id}
                if (!!extra && !!extra.level && !!item && !!item.system && !!item.system.level && !!item.system.level.value) { newItem.level = item.system.level.value }
                if ((!!extra && !!extra.type) || (!!item && !!item.type)) { newItem.type = !!extra && !!extra.type ? extra.type : item.type }

                // console.log('newItem', item)
                pair.push(newItem)
            })
        } else {
            // this.warn(ERRCODES[1],`Error: Array is empty`)
            return pair
        }

        return pair
    }

    _getNamePair(array, type) {
        let pair = []

        if (!!array && array.length > 0) {
            array.forEach(item => {
                pair.push({name: item.name, _id: item._id, type: type, system: item.system})
            })
        } else {
            // this.warn(ERRCODES[1],`Error: Array is empty`)
            return pair
        }

        return pair
    }

    _getFromPair(key, array) {
        if (!!array && array.length > 0) {
            if (!!key && typeof(key) == 'string') {
                const pid = array.findIndex((a) => (!!a.name && a.name == key) || (!!a._id && a._id == key))
                if (pid != -1) {
                    return array[pid]
                } else {
                    this.error(ERRCODES[3],`Error: key ${key} is not in array`)
                    return null
                }
            } else {
                this.error(ERRCODES[2],`Error: key ${key} is not a string`)
                return null
            }
        } else {
            // this.warn(ERRCODES[1],`Error: Array is empty`)
            return null
        }
    }

    _getBoosts(object) {
        let boosts = []

        if (!!object && Object.keys(object).length > 0) {
            Object.values(object).forEach(b => {
                if (!!b && !!b.value) {
                    if (b.value.length == 1) {
                        if (!!this.$rsd.format.abilityBeautify(b.value[0])) {
                            boosts.push(this.$rsd.format.abilityBeautify(b.value[0]))
                        }
                    } else if (b.value.length > 1) {
                        boosts.push('Free')
                    }
                }
            })
        }

        return boosts
    }

    get ancestries() { return AncestryService.getAncestries() }
    get ancestryFeatures() { return AncestryService.getAncestryFeatures() }
    get backgrounds() { return BackgroundService.getBackgrounds() }
    get classes() { return ClassService.getClasses() }
    get classFeatures() { return ClassService.getClassFeatures() }
    get deities() { return DeityService.getDeities() }
    get domains() { return DeityService.getDeityDomains() }
    get feats() { return FeatService.getFeats() }
    get heritages() { return HeritageService.getHeritages() }

    getAncestries() {
        return this._getPair(this.ancestries)
    }
    getAncestryNames() {
        return this._getNamePair(this.ancestries, 'ancestry')
    }
    getAncestriesByRarity(rarity) {
        if (!!rarity && rarity.toLowerCase() != 'all') {
            return this._getPair(this.ancestries.filter(a => !!a && !!a.system && !!a.system.traits && !!a.system.traits.rarity && a.system.traits.rarity.toLowerCase() == rarity.toLowerCase()))
        } else {
            return this._getPair(this.ancestries)
        }
    }
    getAncestry(key) {
        return this._getFromPair(key, this.ancestries)
    }
    getAncestryFeatures() {
        return this._getPair(this.ancestryFeatures)
    }
    getAncestryFeature(key) {
        return this._getFromPair(key, this.ancestryFeatures)
    }

    getBackgrounds() {
        return this._getPair(this.backgrounds)
    }
    getBackgroundNames() {
        return this._getNamePair(this.backgrounds, 'background')
    }
    getBackgroundsByRarity(rarity) {
        if (!!rarity && rarity.toLowerCase() != 'all') {
            return this._getPair(this.backgrounds.filter(a => !!a && !!a.system && !!a.system.traits && !!a.system.traits.rarity && a.system.traits.rarity.toLowerCase() == rarity.toLowerCase()))
        } else {
            return this._getPair(this.backgrounds)
        }
    }
    getBackground(key) {
        return this._getFromPair(key, this.backgrounds)
    }

    getClasses() {
        return this._getPair(this.classes)
    }
    getClassNames() {
        return this._getNamePair(this.classes, 'class')
    }
    getClassesByRarity(rarity) {
        if (!!rarity && rarity.toLowerCase() != 'all') {
            return this._getPair(this.classes.filter(a => !!a && !!a.system && !!a.system.traits && !!a.system.traits.rarity && a.system.traits.rarity.toLowerCase() == rarity.toLowerCase()))
        } else {
            return this._getPair(this.classes)
        }
    }
    getClass(key) {
        return this._getFromPair(key, this.classes)
    }

    getClassFeatures() {
        return this._getPair(this.classFeatures)
    }
    getClassFeature(key) {
        return this._getFromPair(key, this.classFeatures)
    }

    getDeities() {
        return this._getPair(this.deities)
    }
    getDeity(key) {
        return this._getFromPair(key, this.deities)
    }
    getDomains() {
        return this._getPair(this.domains, {type: 'domain'})
    }
    getDomain(key) {
        return this._getFromPair(key, this.domains)
    }

    getFeats() {
        return this._getPair(this.feats)
    }
    getFeat(key) {
        return this._getFromPair(key, this.feats)
    }
    getFeatCategory(category, trait = null) {
        let feat_cat = []
        this.feats.forEach(feat => {
            if (!!feat && !!feat.system && !!feat.system.category && feat.system.category == category) {
                if (!!trait && !!feat.system.traits && !!feat.system.traits.value && feat.system.traits.value.length > 0 && !!feat.system.traits.value.includes(trait.toLowerCase())) {
                    feat_cat.push(feat)
                } else if (!trait) {
                    feat_cat.push(feat)
                }
            }
        })
        return this._getPair(feat_cat)
    }

    getHeritages() {
        return this._getPair(this.heritages)
    }
    getHeritage(key) {
        return this._getFromPair(key, this.heritages)
    }

    getChoices(choiceSet, member, level) {
        if (!!choiceSet && !!choiceSet.choices) {
            // console.log(choiceSet, typeof(choiceSet.choices))
            if (!!choiceSet.choices.pack && !!choiceSet.choices.itemType) {
                if (choiceSet.choices.itemType == 'deity') {
                    // TODO: Maybe make a filter based on the query that usually excludes philosopies
                    return this.getDeities()
                } else if (choiceSet.choices.itemType == 'weapon') {
                    
                } else if (choiceSet.choices.itemType == 'ancestry') {
                    return this.getAncestries()
                } else if (choiceSet.choices.itemType == 'heritage') {
                    return this.getHeritages()
                }
            } else if (typeof(choiceSet.choices) == 'string') {
                if (choiceSet.choices.toLowerCase().includes('deities.domains')) {
                    const domains = this.getDomains()
                    if (!!member && !!level && !!member.build) {
                        let deity = null
                        let returnDomains = [...domains]
                        member.build.forEach(b => {
                            if (!!b && !!b.chc) {
                                let deityChoice = Object.values(b.chc).find(c => !!c && !!c.type && c.type.toLowerCase() == 'deity')
                                if (!!deityChoice && !!deityChoice.val) {
                                    let deityEntry = this.getDeity(deityChoice.val)
                                    if (!!deityEntry) {
                                        let deityObj = this.getDeityObject(deityEntry)
                                        if (!!deityObj && !!deityObj.domains) {
                                            let deityDomains = []
                                            if (!!deityObj.domains.primary && deityObj.domains.primary.length > 0) {
                                                deityObj.domains.primary.forEach(i => {
                                                    if (!!i) {
                                                        deityDomains.push(i+' domain')
                                                    }
                                                })
                                            }
                                            if (!!deityObj.domains.alternate && deityObj.domains.alternate.length > 0) {
                                                deityObj.domains.alternate.forEach(i => {
                                                    if (!!i) {
                                                        deityDomains.push(i+' domain')
                                                    }
                                                })
                                            }
                                            
                                            if (!!deityDomains && deityDomains.length > 0) {
                                                returnDomains = returnDomains.filter(rd => !!rd && !!rd.text && deityDomains.includes(rd.text.toLowerCase()))

                                                // console.log('returnDomains', returnDomains)
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        return returnDomains
                    } else {
                        return domains
                    }
                }
            } else if (!!choiceSet.choices.length && choiceSet.choices.length > 0) {
                let returnChoices = []
                let type = null
                choiceSet.choices.forEach(key => {
                    if (!!key) {
                        let feat = null
                        if (!!key.value && typeof(key.value) == 'string') {
                            feat = this.getFeatByString(key.value)
                        } else if (typeof(key) == 'string') {
                            feat = this.getFeatByString(key)
                        }

                        if (!!feat) {
                            if (!!feat.system && !!feat.system.category) {
                                type = feat.system.category
                            }
                            returnChoices.push(feat)
                        }
                    }
                })
                return this._getPair(returnChoices, {type: type})
            }
        }
    }

    getAncestryFeatChoices(ancestryName, prerequisites) {
        if (!!ancestryName) {
            let feat_cat = []
            this.feats.forEach(feat => {
                if (!!feat && !!feat.system && !!feat.system.category && feat.system.category == 'ancestry') {
                    if (!!feat.system.traits && !!feat.system.traits.value && feat.system.traits.value.length > 0) {
                        if (!!feat.system.traits.value.includes(ancestryName.toLowerCase())) {
                            feat_cat.push(feat)
                        }
                        
                    }
                }
            })

            let pair = []

            if (!!feat_cat && feat_cat.length > 0) {
                feat_cat.forEach(item => {
                    if (!!item && !!item.system && !!item.system.prerequisites && !!item.system.prerequisites.value) {
                        const prerequisitesFulfilled = this.getPrerequisitesMet(item, prerequisites)

                        const newItem = {text: item.name, value: item._id, allowed: prerequisitesFulfilled}
                        if (!!item && !!item.system && !!item.system.level && !!item.system.level.value) { newItem.level = item.system.level.value }
                        if (!!item && !!item.system && !!item.system.traits) {
                            if (!!item.system.traits.rarity) {
                                newItem.rarity = item.system.traits.rarity
                            }
                        }
                        if (!!item && !!item.system && !!item.system.actionType && !!item.system.actionType.value) { newItem.actionType = item.system.actionType.value }
                        if (!!item && !!item.system && !!item.system.actions && !!item.system.actions.value) { newItem.actions = item.system.actions.value }
                        pair.push(newItem)
                    }
                })
            } else {
                // this.warn(ERRCODES[1],`Error: Array is empty`)
                return pair
            }

            return pair
        }
    }

    getClassFeatChoices(className, prerequisites) {
        if (!!className) {
            let feat_cat = []
            this.feats.forEach(feat => {
                if (!!feat && !!feat.system && !!feat.system.category && feat.system.category == 'class') {
                    if (!!feat.system.traits && !!feat.system.traits.value && feat.system.traits.value.length > 0) {
                        if (!!feat.system.traits.value.includes(className.toLowerCase()) || !!feat.system.traits.value.includes('archetype')) {
                            feat_cat.push(feat)
                        }
                        
                    }
                }
            })

            let pair = []

            if (!!feat_cat && feat_cat.length > 0) {
                feat_cat.forEach(item => {
                    if (!!item && !!item.system && !!item.system.prerequisites && !!item.system.prerequisites.value) {
                        const prerequisitesFulfilled = this.getPrerequisitesMet(item, prerequisites)

                        const newItem = {text: item.name, value: item._id, allowed: prerequisitesFulfilled}
                        if (!!item && !!item.system && !!item.system.level && !!item.system.level.value) { newItem.level = item.system.level.value }
                        if (!!item && !!item.system && !!item.system.traits) {
                            if (!!item.system.traits.value) {
                                if (item.system.traits.value.includes(className.toLowerCase())) {
                                    newItem.class = true
                                } else if (item.system.traits.value.includes('dedication')) {
                                    newItem.dedication = true
                                } else if (item.system.traits.value.includes('archetype')) {
                                    newItem.archetype = true
                                }
                            }
                            if (!!item.system.traits.rarity) {
                                newItem.rarity = item.system.traits.rarity
                            }
                        }
                        if (!!item && !!item.system && !!item.system.actionType && !!item.system.actionType.value) { newItem.actionType = item.system.actionType.value }
                        if (!!item && !!item.system && !!item.system.actions && !!item.system.actions.value) { newItem.actions = item.system.actions.value }
                        pair.push(newItem)
                    }
                })
            } else {
                // this.warn(ERRCODES[1],`Error: Array is empty`)
                return pair
            }

            return pair
        }
    }

    getGeneralFeatChoices(prerequisites) {
        let feat_cat = []
        this.feats.forEach(feat => {
            if (!!feat && !!feat.system && !!feat.system.category && (feat.system.category == 'general' || feat.system.category == 'skill')) {
                if (!!feat.system.traits && !!feat.system.traits.value && feat.system.traits.value.length > 0) {
                    if (!!feat.system.traits.value.includes('general')) {
                        feat_cat.push(feat)
                    }
                    
                }
            }
        })

        let pair = []

        if (!!feat_cat && feat_cat.length > 0) {
            feat_cat.forEach(item => {
                if (!!item && !!item.system && !!item.system.prerequisites && !!item.system.prerequisites.value) {
                    const prerequisitesFulfilled = this.getPrerequisitesMet(item, prerequisites)

                    const newItem = {text: item.name, value: item._id, allowed: prerequisitesFulfilled}
                    if (!!item && !!item.system && !!item.system.level && !!item.system.level.value) { newItem.level = item.system.level.value }
                    if (!!item && !!item.system && !!item.system.traits) {
                        if (!!item.system.traits.value) {
                            if (item.system.traits.value.includes('skill')) {
                                newItem.skill = true
                            } else if (item.system.traits.value.includes('general')) {
                                newItem.general = true
                            }
                        }
                        if (!!item.system.traits.rarity) {
                            newItem.rarity = item.system.traits.rarity
                        }
                    }
                    if (!!item && !!item.system && !!item.system.actionType && !!item.system.actionType.value) { newItem.actionType = item.system.actionType.value }
                    if (!!item && !!item.system && !!item.system.actions && !!item.system.actions.value) { newItem.actions = item.system.actions.value }
                    pair.push(newItem)
                }
            })
        } else {
            // this.warn(ERRCODES[1],`Error: Array is empty`)
            return pair
        }

        return pair
    }

    getHeritageChoices(ancestryName) {
        if (!!ancestryName) {
            let heritage_cat = []
            this.heritages.forEach(heritage => {
                if (!!heritage && !!heritage.system && !!heritage.system.ancestry && !!heritage.system.ancestry.name && heritage.system.ancestry.name.toLowerCase() == ancestryName.toLowerCase()) {
                    heritage_cat.push(heritage)
                }
            })

            let pair = []

            if (!!heritage_cat && heritage_cat.length > 0) {
                heritage_cat.forEach(item => {
                    if (!!item && !!item.system) {
                        const newItem = {text: item.name, value: item._id}
                        if (!!item && !!item.system && !!item.system.traits) {
                            if (!!item.system.traits.rarity) {
                                newItem.rarity = item.system.traits.rarity
                            }
                        }
                        pair.push(newItem)
                    }
                })
            } else {
                // this.warn(ERRCODES[1],`Error: Array is empty`)
                return pair
            }

            return pair
        }
    }

    getSkillFeatChoices(prerequisites) {
        let feat_cat = []
        this.feats.forEach(feat => {
            if (!!feat && !!feat.system && !!feat.system.category && feat.system.category == 'skill') {
                if (!!feat.system.traits && !!feat.system.traits.value && feat.system.traits.value.length > 0) {
                    if (!!feat.system.traits.value.includes('skill')) {
                        feat_cat.push(feat)
                    }
                    
                }
            }
        })

        let pair = []


        if (!!feat_cat && feat_cat.length > 0) {
            feat_cat.forEach(item => {
                if (!!item && !!item.system && !!item.system.prerequisites && !!item.system.prerequisites.value) {
                    const prerequisitesFulfilled = this.getPrerequisitesMet(item, prerequisites)

                    const newItem = {text: item.name, value: item._id, allowed: prerequisitesFulfilled}
                    if (!!item && !!item.system && !!item.system.level && !!item.system.level.value) { newItem.level = item.system.level.value }
                    if (!!item && !!item.system && !!item.system.traits) {
                        if (!!item.system.traits.rarity) {
                            newItem.rarity = item.system.traits.rarity
                        }
                    }
                    if (!!item && !!item.system && !!item.system.actionType && !!item.system.actionType.value) { newItem.actionType = item.system.actionType.value }
                    if (!!item && !!item.system && !!item.system.actions && !!item.system.actions.value) { newItem.actions = item.system.actions.value }
                    pair.push(newItem)
                }
            })
        } else {
            // this.warn(ERRCODES[1],`Error: Array is empty`)
            return pair
        }

        return pair
    }

    getPrerequisitesMet(item, prerequisites) {
        let prerequisitesFulfilled = true
        if (!!item && !!item.system && !!item.system.prerequisites && !!item.system.prerequisites.value) {
            if (item.system.prerequisites.value.length > 0) {
                item.system.prerequisites.value.forEach(req => {
                    if (!!req && !!req.value && !!prerequisitesFulfilled) {
                        let reqFulfilled = false
                        prerequisites.forEach(pre => {
                            // if (item.name.toLowerCase() == 'prayer-touched weapon') {
                            //     console.log('ptw', req.value.toLowerCase(), pre)
                            // }
                            if (!!pre) {
                                reqFulfilled = reqFulfilled || req.value.toLowerCase().includes(pre)
                            }
                        })
                        
                        prerequisitesFulfilled = prerequisitesFulfilled && reqFulfilled
                    }
                })
            }
        }
        return prerequisitesFulfilled
    }
    getSkillExpertise(member, level) {
        let returnArray = []
        if (!!member && !!member.id && !!level) {
            const skills = this.$rsd.playercharacters.getSkillsArrayLevel(member.id, level)
            const skillCount = this.$rsd.playercharacters.getSkillCount(skills)
            const abilities = this.$rsd.playercharacters.getScoreArrayLevel(member.id, level)

            Object.keys(abilities).forEach(index => {
                const abilityName = this.$rsd.format.scoreNames[index]
                const abilityScore = abilities[index]
                returnArray.push(`${abilityName} ${abilityScore}`)
            })

            Object.keys(skillCount).forEach(skillShort => {
                if (!!skillShort) {
                    const skillLevel = this.$rsd.format.proficiencyType(skillCount[skillShort]).toLowerCase()
                    const skillFullname = this.$rsd.format.skillBeautify(skillShort).toLowerCase()

                    if (!!skillLevel && !!skillFullname) {
                        switch(skillLevel) {
                            case 'legendary':
                                returnArray.push(`legendary in ${skillFullname}`)
                            case 'master':
                                returnArray.push(`master in ${skillFullname}`)
                            case 'expert':
                                returnArray.push(`expert in ${skillFullname}`)
                            case 'trained':
                                returnArray.push(`trained in ${skillFullname}`)
                                break;
                        }

                        if (!returnArray.includes('trained in at least one skill')) {
                            returnArray.push('trained in at least one skill')
                        }
                    }
                }
            })
        }
        return returnArray
    }

    getFeatChoices(category, trait = null) {
        if (!!category) {
            return this.getFeatCategory(category, trait)
        }
    }

    getFeatByString(uuid) {
        let returnFeature = {}
        if (!!uuid) {
            const split = uuid.split('.')
            let type = ''
            let key = ''
            if (!!split && split.length == 5) {
                type = split[2]
                key = split[4]
            } else if (!!split && split.length == 4) {
                type = split[2]
                key = split[3]
            } else if (!!split && split.length == 2) {
                type = split[0]
                key = split[1]
            }

            if (type == 'classfeatures' || type == 'classfeature') {
                returnFeature = this.getClassFeature(key)
            } else if (type == 'feats-srd') {
                returnFeature = this.getFeat(key)
            } else if (type == 'ancestryfeatures') {

            } else if (type == 'spells-srd') {
                returnFeature = this.$rsd.spells.get(key)
            } else if (type == 'deity') {
                returnFeature = this.getDeity(key)
            } else if (type == 'domain') {
                returnFeature = this.getDomain(key)
            }

            // if (!!returnFeature && !!returnFeature.name) {
            //     console.log(returnFeature.name, returnFeature)
            // }
        }
        return returnFeature
    }

    getAncestryObject(item) {
        let object = {}

        if (!!item && !!item.system && !!item.system.traits) {
            const boosts = !!item.system.boosts ? this._getBoosts(item.system.boosts) : null
            const flaws = !!item.system.flaws ? this._getBoosts(item.system.flaws) : null

            object = {
                size: !!item.system.size ? this.$rsd.format.sizeBeautify(item.system.size) : null,
                rarity: !!item.system.traits.rarity ? item.system.traits.rarity : null,
                traits: !!item.system.traits.value ? item.system.traits.value : null,
                mechanics: !!item.system.mechanicsDescription && item.system.mechanicsDescription.length > 0 ? item.system.mechanicsDescription : null,
                hp: !!item.system.hp ? item.system.hp : null,
                speed: !!item.system.speed ? item.system.speed : null,
                boosts: !!boosts ? boosts : null,
                flaws: !!flaws ? flaws : null,
                languages: !!item.system.languages && !!item.system.languages.value ? item.system.languages.value : null,
                additionalLanguages: !!item.system.additionalLanguages ? item.system.additionalLanguages : null,
            }
        }

        return object
    }

    getBackgroundObject(item) {
        let object = {}

        if (!!item && !!item.system && !!item.system.traits) {
            object = {
                description: !!item.system.description && !!item.system.description.value ? item.system.description.value : null,
                rarity: !!item.system.traits.rarity ? item.system.traits.rarity : null,
                traits: !!item.system.traits.value ? item.system.traits.value : null,
            }
        }

        return object
    }

    getClassObject(item) {
        let object = {}

        if (!!item && !!item.system && !!item.system.traits) {
            object = {
                mechanics: !!item.system.mechanicsDescription && item.system.mechanicsDescription.length > 0 ? item.system.mechanicsDescription : null,
                rarity: !!item.system.traits.rarity ? item.system.traits.rarity : null,
                traits: !!item.system.traits.value ? item.system.traits.value : null,
            }
        }

        return object
    }
    getClassFeatureObject(item) {
        let object = {}

        if (!!item && !!item.system) {
            // console.log('classfeature', item)
            object = {
                description: !!item.system.description && !!item.system.description.value ? item.system.description.value : null,
                level: !!item.system.level ? item.system.level : null,
                prerequisites: !!item.system.prerequisites && item.system.prerequisites.length > 0 ? item.system.prerequisites : null,
                type: !!item.system.category ? item.system.category : null
            }
        }
        return object
    }
    getClassItems(member, level) {
        let returnArray = []
        if (!!member && !!level) {
            returnArray = this.getAllFeatureItems(member, level)
        }
        return returnArray
    }
    getAllFeatureItems(member, level, levelOnly = true) {
        let returnArray = []
        if (!!member && !!level) {
            let levelFeatures = []
            let hasFeatures = []
            levelFeatures = !!member.classObj && !!member.classObj.system ? levelFeatures.concat(Object.values(member.classObj.system.items).filter(i => !!i && i.level <= level)) : levelFeatures
            levelFeatures = !!member.backgroundObj && !!member.backgroundObj.system ? levelFeatures.concat(Object.values(member.backgroundObj.system.items).filter(i => !!i && i.level <= level)) : levelFeatures

            member.build.forEach((l, index) => {
                if (index <= level || !levelOnly) {
                    if (!!l && !!l.chc && Object.keys(l.chc).length > 0) {
                        Object.values(l.chc).forEach(c => {
                            if (!!c && !!c.val && !!c.type) {
                                const feat = this.getSearchFunction(c.type, c.val)
                                
                                if (!!feat && !!feat.name) {
                                    levelFeatures.push(feat)
                                    const featName = feat.name.toLowerCase().replaceAll(' ','-')
                                    hasFeatures.push(`feature:${featName}`)
                                }
                            }
                        })
                    }
                }
            })

            // if (!levelOnly) {
            //     console.log('getAllFeatureItems', levelFeatures)
            // }

            let featureRules = []

            const obj = this._getFeatureRecursive(member, level, levelFeatures, featureRules, levelOnly)

            if (!!obj) {
                if (!!obj.features && obj.features.length > 0) {
                    
                    obj.features.forEach(f => {
                        if (!!f && !!f.name) {
                            returnArray.push(f)
                            const featName = f.name.toLowerCase().replaceAll(' ','-')
                            hasFeatures.push(`feature:${featName}`)
                        }
                    })
                }
                if (!!obj.rules && !!obj.rules.length > 0) {
                    featureRules = featureRules.concat(obj.rules)
                }
            }
            
            const extraObj = this._processNewFeatureRules(member, level, returnArray, featureRules, levelOnly, hasFeatures)

            if (!!extraObj) {
                if (!!extraObj.features && extraObj.features.length > 0) {
                    extraObj.features.forEach(ef => {
                        if (!!ef && !!ef.name && !this._isFeatureDuplicate(returnArray, ef)) {
                            // console.log('newrules:', extraObj.rules)
                            returnArray.push(ef)
                            const featName = ef.name.toLowerCase().replaceAll(' ','-')
                            hasFeatures.push(`feature:${featName}`)
                        }
                    })
                }
                if (!!extraObj.rules && !!extraObj.rules.length > 0) {
                    featureRules = featureRules.concat(extraObj.rules)
                }
            }
            // console.log('returnArray', returnArray)

            // Remove double values based on name.
            // Reason to do this, is for instance; 'First Doctrine' is redundant when 'First Doctrine (Cloistered Cleric)' is already available
            let removalIDs = []

            returnArray.forEach(f => {
                if (!!f && !!f.name && !!f._id) {
                    const searchIndex = returnArray.findIndex(r => {
                        if (!!r && !!r.name && !!r._id && r._id != f._id && r.name.toLowerCase().includes(f.name.toLowerCase())) {
                            const nameLength = f.name.length
                            return r.name.toLowerCase().substr(0, nameLength) == f.name.toLowerCase()
                        } else {
                            return false
                        }
                    })
                    if (searchIndex != -1) {
                        removalIDs.push(f._id)
                    }
                }
            })

            returnArray = returnArray.filter(f => !!f._id && !removalIDs.includes(f._id))

            // Sort ascending based on name
            returnArray.sort(this.$rsd.format.compareByName)
        }
        return returnArray
    }
    _getFeatureRecursive(member, level, features, rules, levelOnly = true) {
        const returnObj = {features: [], rules: rules}

        if (!!member, !!level, !!features) {
            features.forEach(f => {
                if (!!f) {
                    const obj = this._getFeatureAllowedAndRules(member, level, f, returnObj.rules, levelOnly)
                    if (!!obj && !!obj.feature) {
                        returnObj.rules = obj.rules
                        // console.log('returnObj.features', returnObj.features)
                        if (!this._isFeatureDuplicate(returnObj.features, obj.feature)) {
                            returnObj.features.push(obj.feature)
                        }

                        const choice = this._getFeatureAllowedAndRules(member, level, obj.feature, returnObj.rules, levelOnly)
                        // console.log('choice', choice)
                        if (!!choice && !!choice.feature) {
                            returnObj.rules = choice.rules
                            if (!this._isFeatureDuplicate(returnObj.features, choice.feature)) {
                                returnObj.features.push({...choice.feature, _parentid: obj.feature._id})
                            }
                        }
                    }
                }
            })
        }

        return returnObj
    }
    // This helper function checks if the feature is not a duplicate
    _isFeatureDuplicate(features, feature) {
        return !!features && !!feature && !!feature._id && features.length > 0 && features.findIndex(f => !!f && !!f._id && f._id == feature._id) != -1
    }
    // This helper function helps check if the feature is correct and adds the rules to the rules array
    _getFeatureAllowedAndRules(member, level, feature, rules, levelOnly){
        const returnObj = {feature: null, rules: rules}
        if (!!member, !!level, !!feature) {
            let featureObj = null
            if (!!feature.uuid) {
                featureObj = this.getFeatByString(feature.uuid)
            } else if (!!feature._id) {
                if (!!levelOnly) {
                    featureObj = this._getChoiceValue(member, level, feature)
                } else {
                    for(let i = 1; i <= level; i++) {
                        let choiceVal = this._getChoiceValue(member, i, feature)
                        if (!!choiceVal) {
                            featureObj = choiceVal
                        }
                    }
                }

                if (featureObj == null) {
                    featureObj = feature
                }
            }
            if (!!featureObj && !!featureObj.system && !!featureObj._id) {                                
                if (!!featureObj.system.rules && featureObj.system.rules.length > 0){
                    returnObj.rules = returnObj.rules.concat(featureObj.system.rules)
                }

                if (!!levelOnly && !!featureObj.system.level && !!featureObj.system.level.value && featureObj.system.level.value == level) {
                    returnObj.feature = featureObj
                } else if (!levelOnly) {
                    returnObj.feature = featureObj
                }
            }
        }
        return returnObj
    }
    _getChoiceValue(member, level, feature) {
        if (!!member && !!level && !!feature && !!feature._id) {
            if (!!member.build && !!member.build[level] && !!member.build[level].chc && !!member.build[level].chc[feature._id]) {
                const choice = member.build[level].chc[feature._id]
                const choiceString = choice.type + '.' + choice.val
                const choiceFeature = this.$rsd.build.getFeatByString(choiceString)

                return choiceFeature
            }
        }
    }
    _processNewFeatureRules(member, level, features, rules, levelOnly = true, hasFeatures = null) {
        let returnObj = {features: features, rules: rules}
        let newHasFeatures = !!hasFeatures ? [...hasFeatures] : []
        if (!!member, !!level, !!features) {
            let newFeaturesAdded = false
            let additionalFeatures = []

            // console.log('returnObj.rules', returnObj.rules)
            returnObj.rules.forEach(f => {
                if (!!f && !!f.key) {
                    if (f.key.toLowerCase() == 'grantitem' && !!f.uuid) {
                        let uuidSplit = f.uuid.replaceAll(/[\{\}]/g,'').split('|')

                        let predicateMet = true
                        if (!!f.predicate && f.predicate.length > 0) {
                            f.predicate.forEach(p => {
                                if (!!p) {
                                    predicateMet = predicateMet && newHasFeatures.includes(p)
                                }
                            })
                        }

                        if (!!predicateMet && !!uuidSplit && f.uuid.toLowerCase().includes('flags') && uuidSplit.length == 2) {
                            let flagSplit = uuidSplit[1].split('.')
                            if (!!flagSplit && flagSplit.length == 4) {
                                const pathSelect = flagSplit[3]
                                const pathToken = `${flagSplit[0]}.${flagSplit[1]}.${flagSplit[2]}`
                                const pathItem = returnObj.rules.find(fr => {
                                    if (!!fr && !!fr.path) {
                                        return fr.path == pathToken
                                    } else {
                                        return false
                                    }
                                })

                                if (!!pathItem && !!pathItem.value && !!pathItem.value[pathSelect]) {
                                    const notDuplicate = additionalFeatures.findIndex(ad => ad.uuid == pathItem.value[pathSelect]) == -1
                                    if (!!notDuplicate) {
                                        additionalFeatures.push({uuid: pathItem.value[pathSelect]})
                                    }
                                }
                            }
                        } else if (!!predicateMet && !!uuidSplit && f.uuid.toLowerCase().includes('compendium') && uuidSplit.length == 1) {
                            const notDuplicate = additionalFeatures.findIndex(ad => ad.uuid == f.uuid) == -1
                            if (!!notDuplicate) {
                                additionalFeatures.push({uuid: f.uuid})
                            }
                        }
                    }
                }
            })

            if (!!additionalFeatures && additionalFeatures.length > 0){
                // console.log('additionalFeatures', [...additionalFeatures])
                const extraObj = this._getFeatureRecursive(member, level, additionalFeatures, returnObj.rules, levelOnly)

                if (!!extraObj) {
                    if (!!extraObj.features && extraObj.features.length > 0) {
                        extraObj.features.forEach(ef => {
                            if (!!ef && !!ef.name && !this._isFeatureDuplicate(returnObj.features, ef)) {
                                returnObj.features.push(ef)
                                newFeaturesAdded = true
                                // console.log('newFeatureAdded', ef)
                                const featName = ef.name.toLowerCase().replaceAll(' ','-')
                                newHasFeatures.push(`feature:${featName}`)
                            }
                        })
                    }
                    if (!!extraObj.rules && !!extraObj.rules.length > 0) {
                        returnObj.rules = returnObj.rules.concat(extraObj.rules)
                    }
                }
            }

            if (!!newFeaturesAdded) {
                returnObj = this._processNewFeatureRules(member, level, returnObj.features, returnObj.rules, levelOnly)
            }
        }
        return returnObj
    }

    getDeityObject(item) {
        let object = {}

        if (!!item && !!item.system) {
            object = {
                ability: !!item.system.ability && item.system.ability.length > 0 ? item.system.ability : null,
                category: !!item.system.category ? item.system.category : null,
                description: !!item.system.description && !!item.system.description.value ? item.system.description.value : null,
                domains: !!item.system.domains ? item.system.domains : null,
                font: !!item.system.font ? item.system.font : null,
                skill: !!item.system.skill ? item.system.skill : null,
                spells: !!item.system.spells ? item.system.spells : null,
                weapons: !!item.system.weapons ? item.system.weapons : null,
                type: 'deity'
            }
        }

        return object
    }

    getDomainObject(item) {
        let object = {}

        if (!!item && !!item.name) {
            object = {
                description: !!item.content ? item.content : null,
                name: item.name,
                type: 'domain'
            }
        }

        return object
    }

    getFeatObject(item) {
        let object = {}

        if (!!item && !!item.system && !!item.system.traits) {
            object = {
                actionType: !!item.system.actionType && !!item.system.actionType.value ? item.system.actionType.value : null,
                description: !!item.system.description && !!item.system.description.value ? item.system.description.value : null,
                name: !!item.name ? item.name : null,
                level: !!item.system.level && !!item.system.level.value ? item.system.level.value : null,
                prerequisites: !!item.system.prerequisites && !!item.system.prerequisites.value ? item.system.prerequisites.value : null, 
                rarity: !!item.system.traits.rarity ? item.system.traits.rarity : null,
                source: !!item.system.source && !!item.system.source.value ? item.system.source.value : null,
                traits: !!item.system.traits.value ? item.system.traits.value : null,
                type: 'feat'
            }
        }

        return object
    }

    getHeritageObject(item) {
        let object = {}

        if (!!item && !!item.system) {
            // console.log('classfeature', item)
            object = {
                description: !!item.system.description && !!item.system.description.value ? item.system.description.value : null,
                name: !!item.name ? item.name : null,
                rarity: !!item.system.traits.rarity ? item.system.traits.rarity : null,
                source: !!item.system.source && !!item.system.source.value ? item.system.source.value : null,
                type: 'heritage'
            }
        }
        return object
    }

    getBoostsObject(ancestryObj, backgroundObj, classObj) {
        let object = {}

        if (!!ancestryObj && !!ancestryObj.system && !!backgroundObj && !!backgroundObj.system && !!classObj && !!classObj.system) {
            object.a = this._getBoostItems(ancestryObj.system.boosts, false)
            object.a = this._getBoostItems(ancestryObj.system.flaws, true, object.a)

            object.b = this._getBoostItems(backgroundObj.system.boosts, false)
            object.c = this._getBoostItems([classObj.system.keyAbility], false)
        }

        // console.log('object', object)
        return object
    }

    getCalculatedScoresArray(base, template, choices) {
        let returnArray = [10,10,10,10,10,10]
        if (!!base && !!choices) {
            returnArray = [...base]

            Object.keys(choices).forEach(key => {
                const value = choices[key]
                if (!!key && !!value && key != 'id') {
                    if (key == 'fb' && value.length > 0) {
                        value.forEach(score_val => {
                            const score_index = this.$rsd.format.scoreIndexes[score_val]
                            if (!!score_index || score_index == 0) {
                                returnArray[score_index] = returnArray[score_index] >= 18 ? returnArray[score_index] + 1 : returnArray[score_index] + 2
                            }
                        })
                    } else if (key.length == 3 && !!template) {
                        const category = key[0]
                        const index = Number(key[2])

                        const flaw = !!template[category] && !!template[category][index] && !!template[category][index].flaw
                        const score_index = this.$rsd.format.scoreIndexes[value]
                        if (!!score_index || score_index == 0) {
                            returnArray[score_index] = !!flaw ? returnArray[score_index] - 2 : (returnArray[score_index] >= 18 ? returnArray[score_index] + 1 : returnArray[score_index] + 2)
                        }
                    }
                }
            })
        }
        return returnArray
    }

    getPrerequisites(member, level) {
        let prerequisites = []
        if (!!member && !!member.build && !!level) {
            let allFeats = this.getAllFeatureItems(member, level, false)
            // console.log('allFeats', allFeats)

            if (!prerequisites.includes('alignment')) {
                prerequisites.push('alignment')
                prerequisites.push('aligned')
            }
            
            allFeats.forEach(item => {
                if (!!item && !!item.system && (!item.system.level || !!item.system.level && !!item.system.level.value && item.system.level.value <= level) && !!item.type) {
                    // Cleric hack for deity related stuff like font
                    // console.log('item', item)
                    if (item.type == 'deity') {
                        prerequisites.push('deity')
                        prerequisites.push(item.name.toLowerCase())
                        if (!!item.system.font && item.system.font.length > 0) {
                            if (item.system.font.includes('heal')) {
                                prerequisites.push('healing font')
                            }
                            if (item.system.font.includes('harm')) {
                                prerequisites.push('harmful font')
                            }
                        }
                    } else if (!prerequisites.includes(item.name.toLowerCase())) {
                        if (item.name.toLowerCase().includes('spellcasting') || item.name.toLowerCase().includes('spells')) {
                            prerequisites.push(item.name.toLowerCase())

                            let itemSplit = item.name.toLowerCase().split(' ')
                            if (!!itemSplit && itemSplit.length > 0) {
                                prerequisites.push(itemSplit[0] + ' spells')
                                prerequisites.push(itemSplit[0] + ' spellcasting')
                            }
                        } else {
                            prerequisites.push(item.name.toLowerCase())
                        }
                    }
                }
            })
        }
        return prerequisites
    }

    getSearchFunction(type, item) {
        if (type == 'deity') {
            return this.getDeity(item)
        } else if (type == 'domain') {
            return this.getDomain(item)
        } else if (type == 'classfeature') {
            return this.getClassFeature(item)
        } else if (type == 'feat') {
            return this.getFeat(item)
        } else if (type == 'heritage') {
            return this.getHeritage(item)
        }
    }
    getObjectFunction(type, item) {
        if (type == 'deity') {
            return this.getDeityObject(item)
        } else if (type == 'domain') {
            return this.getDomainObject(item)
        } else if (type == 'classfeature') {
            return this.getClassFeatureObject(item)
        } else if (type == 'feat') {
            return this.getFeatObject(item)
        } else if (type == 'heritage') {
            return this.getHeritageObject(item)
        }
    }
    getChosenOption(choices, featureID) {
        let returnID = null
        Object.keys(choices).forEach(c => {
            if (!!c && c == featureID) {
                returnID = choices[c].val
            }
        })
        return returnID
    }

    isFoundryException(feature) {
        return !!feature && (!!ID_EXCEPTIONS.includes(feature._id) || !!NAME_EXCEPTIONS.includes(feature.name))
    }

    _getBoostItems(items, flaw, returnArray = []) {
        if (!!items) {
            Object.values(items).forEach(item => {
                if (!!item && !!item.value && item.value.length > 0) {
                    returnArray.push({
                        flaw: flaw,
                        choice: item.value.length > 1 ? true : false,
                        items: item.value
                    })
                }
            })
        }

        return returnArray
    }
}