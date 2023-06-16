const localizeRegex = /\@Localize\[([a-zA-Z0-9\.]+)\]/g
const damageRegex = /\[\[\/r+[^\]\]]+\]{1,}\{([^\}]+)\}/g
const altDamageRegex = /\[\[\/r\ {([^\}]+)}\[[a-z\,]+\]\]\]/g
const diceRegex = /\[\[\/r ([0-9]+[dD][0-9]+)\]\]/g
const timeRegex = /\[\[\/br+[^\]\]]+\]{1,}\{([^\}]+)\}/g
const compendiumRegex = /@Compendium\[[\.a-zA-Z0-9\-\:\ \(\)]+\]\{([\.a-zA-Z0-9\-\:\ \(\)]+)\}/g
const templateRegex = /@Template\[([^\]]+)\](\{[^\}]+\})?/g;
const checkRegex = /@Check\[([^\]]+)\](\{[^\}]+\})?/g;
const uuidRegex = /@UUID\[[^\]]+]\{([^\}]+)\}/g;

class SpellParser {
    constructor() {}

    init(StaticService) {
        this.StaticService = StaticService
    }

    parseSpell(spell) {
        return this.parseItem(spell)
    }

    parseItem(item) {
        if (item.system && item.system.foundryDescription && item.system.foundryDescription.value && item.system.foundryDescription.value.length > 0) {
            if (item.system.foundryDescription.value.includes('@Localize')) {
                const localize = this.StaticService.getEN()
                const localize_re = this.StaticService.getRE_EN()

                const localizeArray = item.system.foundryDescription.value.matchAll(localizeRegex)

                let nextLocalize = localizeArray.next()
                while (!nextLocalize.done) {
                    
                    let localizeKeyArray = nextLocalize.value[1].split('.')
                    let newLocalString = null
                    newLocalString = this.getLocalizedChild(localize, localizeKeyArray) || this.getLocalizedChild(localize_re, localizeKeyArray)

                    item.system.foundryDescription.value = item.system.foundryDescription.value.replace(nextLocalize.value[0], newLocalString)

                    nextLocalize = localizeArray.next()
                }
            }

            let newDescription = this.regexRemove(item.system.foundryDescription.value)

            // if (item.name == 'Death Light') {
                item.system.parsedDescription = this.convertHTMLToObject(newDescription)
            // }
            
            
        }

        return item
    }

    convertHTMLToObject(html) {
        let el = document.createElement('div')
        el.innerHTML = html

        let object = this.parseChildNode(el)

        return object
        // console.log(el)
        // console.log(el.children)
    }

    parseChildNode(node) {
        let result = []

        if (!!node) {
            // console.log(node)
            if (!!node.childNodes && !!node.childNodes.length > 0) {
                node.childNodes.forEach(child => {
                    if (!!child && child.nodeName == '#text') {
                        if (child.data != '\n') {
                            result.push({
                                type: 'TEXT',
                                data: child.data
                            })
                        }
                    } else if (!!child && child.nodeName == "HR") {
                        result.push({
                            type: 'HR'
                        })
                    } else if (!!child && child.nodeName == "SKILL") {
                        result.push({
                            type: 'SKILL',
                            dc: child.dataset.dc,
                            basic: !!child.dataset.basic,
                            save: child.dataset.save
                        })
                    } else if (!!child) {
                        const processedChild = this.parseChildNode(child)
                        result.push({
                            type: child.nodeName,
                            children: processedChild
                        })
                    }
                    
                })
            }
        }

        return result
    }

    getLocalizedChild(obj, children) {
        if (children.length > 0) {
            let nextNode = children.splice(0,1)
            if (!!obj[nextNode[0]]) {
                return this.getLocalizedChild(obj[nextNode[0]], children)
            } else {
                return null
            }
        } else {
            return obj
        }
    }

    regexRemove(description) {
        if (!!description) {
            description = this.removeCompendiumString(description)
            description = this.removeTemplateString(description)
            description = this.removeCheckString(description)
            description = this.removeDamageString(description)
            description = this.removeDiceString(description)
            description = this.removeTimeString(description)
            description = this.removeUUIDString(description)
        }
    
        return description
    }
    
    removeCompendiumString(description) {
        return !!description ? description.replace(compendiumRegex, '<i>$1</i>') : ''
    }
    
    // Template
    removeTemplateString(description) {
        let matches = description.matchAll(templateRegex);
        let iterator = matches.next();
    
        while(!iterator.done) {
            let info = iterator.value[1].split('|');
            let newInfo = {};
            info.forEach(i => {
                if (i.includes('type')) {
                    newInfo.type = i.split(':')[1];
                } else if (i.includes('distance')) {
                    newInfo.distance = i.split(':')[1];
                }
            })
    
            let replacementText = `${newInfo.distance}-foot ${newInfo.type}`;
    
            let replaceIndex = description.indexOf(iterator.value[0]);
    
            description = description.substr(0, replaceIndex) + replacementText + description.substr(replaceIndex + iterator.value[0].length, description.length - (iterator.value.index + iterator.value[0].length));
            iterator = matches.next();
        }
    
        return description
    }
    
    // Check
    removeCheckString(description) {
        let matches = description.matchAll(checkRegex);
        let iterator = matches.next();
    
        while(!iterator.done) {
            let info = iterator.value[1].split('|');
            let newInfo = {};
            info.forEach(i => {
                if (i.includes('type')) {
                    newInfo.type = i.split(':')[1];
                } else if (i.includes('dc')) {
                    newInfo.dc = i.split(':')[1];
                } else if (i.includes('name')) {
                    newInfo.name = i.split(':')[1];
                } else if (i.includes('basic')) {
                    newInfo.basic = true
                } else if (i.includes('traits')) {
                    newInfo.traits = i.split(':')[1];
                }
            })
    
            let replacementText = `<skill data-dc="${newInfo.dc}" data-save="${newInfo.type}"></skill>`;
            if (!!newInfo.basic) {
                replacementText = `<skill data-dc="${newInfo.dc}" data-save="${newInfo.type}" data-basic="true"></skill>`;
            }
    
            let replaceIndex = description.indexOf(iterator.value[0]);
    
            description = description.substr(0, replaceIndex) + replacementText + description.substr(replaceIndex + iterator.value[0].length, description.length - (iterator.value.index + iterator.value[0].length));
            iterator = matches.next();
        }
        
        return description
    }
    
    removeDamageString(description) {
        return description.replace(damageRegex, '<b>$1</b>').replace(altDamageRegex, '<b>$1</b>')
    }

    removeDiceString(description) {
        return description.replace(diceRegex, '<b>$1</b>')
    }
    
    removeTimeString(description) {
        return description.replace(timeRegex, '<i>$1</i>')
    }

    removeUUIDString(description) {
        return description.replace(uuidRegex, '<b>$1</b>')
    }
    
    capitalize(item) {
        return item.charAt(0).toUpperCase() + item.slice(1)
    }
}

export default new SpellParser()