const localizeRegex = /\@Localize\[([a-zA-Z0-9\.]+)\]/g
const damageRegex = /\[\[\/r+[^\]\]]+\]{1,}\{([^\}]+)\}/g
const damageRegex2 = /\[\[\/r.+(]]])\{([^\}]+)\}/g
const damageDiceRegex = /\[\[\/r\ ([0-9]+d[0-9]+)\[([a-zA-Z,]+)\]\]\]/g
const damageDiceTwoRegex = /\[\[\/r\ \{([0-9]+d[0-9]+)\[([a-zA-Z,]+)\],([0-9]+d[0-9]+)\[([a-zA-Z,]+)\]\}\]\]\{[^\}]+\}/g
const damageStaticRegex = /\[\[\/r\ ([0-9]+)\[([a-zA-Z,]+)\]\]\]/g
const timeRegex = /\[\[\/br+[^\]\]]+\]{1,}\{([^\}]+)\}/g
const templateRegex = /@Template\[([^\]]+)\](\{[^\}]+\})?/g;
const checkRegex = /@Check\[([^\]]+)\](\{[^\}]+\})?/g;
const dcRegex = /DC\ ([0-9]{1,})/g;
const newUUIDRegex = /@UUID\[(([a-zA-Z0-9\-\:\ \(\)\']+\.?){4,5})\]/g
const oldUUIDRegex = /@UUID\[(([a-zA-Z0-9\-\:\ \(\)\']+\.?){4,5})\]\{([\.a-zA-Z0-9\-\:\ \(\)\']+)\}/g

class BestiaryParser {
    constructor() {}

    init(StaticService) {
        this.StaticService = StaticService
    }

    parseBeast(beast) {
        if (beast.items && Object.keys(beast.items).length > 0) {
            Object.values(beast.items).forEach((item, i) => {
                beast.items[i] = this.parseItem(item)
            });
        }

        if (beast.system && beast.system.details) {
            if (beast.system.details.disable) {
                let newDescription = this.regexRemove(beast.system.details.disable)
                beast.system.details.parsedDisable = this.convertHTMLToObject(newDescription)

                // if (beast.name.toLowerCase() == 'seismic spears trap') {
                //     console.log('newDescription', newDescription)
                // }
            }
            if (beast.system.details.reset) {
                let newDescription = this.regexRemove(beast.system.details.reset)
                beast.system.details.parsedReset = this.convertHTMLToObject(newDescription)
            }
            if (beast.system.details.routine) {
                let newDescription = this.regexRemove(beast.system.details.routine)
                beast.system.details.parsedRoutine = this.convertHTMLToObject(newDescription)
            }
        }
    
        return beast
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

        if (Object.keys(object).length >= 1 && object[0].type == 'P') {
            object[0].type = 'SPAN'
        }

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
                    } else if (!!child && child.nodeName == "DAMAGE") {
                        const persistent = !!child.dataset.type.includes('persistent')
                        const attributes = child.dataset.type.replace('persistent,','').split(',')

                        result.push({
                            type: 'DAMAGE',
                            persistent: persistent,
                            attributes: attributes,
                            value: child.dataset.value
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
            if (!!description.includes('@Template')) {
                description = this.removeTemplateString(description)
            }
            if (!!description.includes('@Check')) {
                description = this.removeCheckString(description)
            }
            description = this.convertDCString(description)
            description = this.removeDamageDiceTwoRegex(description)
            description = this.removeDamageDiceString(description)
            description = this.removeDamageStaticString(description)
            description = this.removeDamageString(description)
            description = this.removeDamage2String(description)
            description = this.removeTimeString(description)

            if (!!description.includes('@UUID')) {
                description = this.removeOldUUIDString(description)
            }
            if (!!description.includes('@UUID')) {
                description = this.removeNewUUIDString(description)
            }
        }
    
        return description
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

    // Any random DC we missed
    convertDCString(description) {
        let matches = description.matchAll(dcRegex);
        let iterator = matches.next();
    
        while(!iterator.done) {
            let newInfo = {
                dc: iterator.value[1]
            };
    
            let replacementText = `<skill data-dc="${newInfo.dc}"></skill>`;
    
            let replaceIndex = description.indexOf(iterator.value[0]);
    
            description = description.substr(0, replaceIndex) + replacementText + description.substr(replaceIndex + iterator.value[0].length, description.length - (iterator.value.index + iterator.value[0].length));
            iterator = matches.next();
        }
        
        return description
    }
    
    // TODO: Add damage recognition here, for weak/elite
    removeDamageString(description) {
        return description.replace(damageRegex, '<b>$1</b>')
    }
    removeDamage2String(description) {
        return description.replace(damageRegex2, '<b>$2</b>')
    }
    removeDamageDiceString(description) {
        return description.replace(damageDiceRegex, `<damage data-value="$1" data-type="$2"></damage>`)
    }
    removeDamageDiceTwoRegex(description) {
        return description.replace(damageDiceTwoRegex, `<damage data-value="$1" data-type="$2"></damage> plus <damage data-value="$3" data-type="$4"></damage>`)
    }
    removeDamageStaticString(description) {
        return description.replace(damageStaticRegex, '<damage data-value="$1" data-type="$2"></damage>')
    }
    
    removeTimeString(description) {
        return description.replace(timeRegex, '<i>$1</i>')
    }

    removeOldUUIDString(description) {
        return description.replace(oldUUIDRegex, '<b data-compendium="$1">$3</b>')
    }

    removeNewUUIDString(description) {
        return description.replace(newUUIDRegex, '<b data-compendium="$1">$2</b>')
    }
    
    capitalize(item) {
        return item.charAt(0).toUpperCase() + item.slice(1)
    }
}

export default new BestiaryParser()