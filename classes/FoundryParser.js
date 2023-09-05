const LOCALIZE_REGEX = /\@Localize\[([a-zA-Z0-9\.]+)\]/g
const DAMAGE_REGEXES = [
    {'regex': /\[\[\/r+[^\]\]]+\]{1,}\{([^\}]+)\}/g, 'replace': '<b>$1</b>'},
    {'regex': /\[\[\/r.+(]]])\{([^\}]+)\}/g, 'replace': '<b>$2</b>'},
    {'regex': /\[\[\/r\ ([0-9]+d[0-9]+)\[([a-zA-Z,]+)\]\]\]/g, 'replace': '<damage data-value="$1" data-type="$2"></damage>'},
    {'regex': /\[\[\/r\ \{([0-9]+d[0-9]+)\[([a-zA-Z,]+)\],([0-9]+d[0-9]+)\[([a-zA-Z,]+)\]\}\]\]\{[^\}]+\}/g, 'replace': '<damage data-value="$1" data-type="$2"></damage> plus <damage data-value="$3" data-type="$4"></damage>'},
    {'regex': /\[\[\/r\ ([0-9]+)\[([a-zA-Z,]+)\]\]\]/g, 'replace': '<damage data-value="$1" data-type="$2"></damage>'}
];
const TIME_REGEX = {'regex': /\[\[\/br+[^\]\]]+\]{1,}\{([^\}]+)\}/g, 'replace': '<i>$1</i>'}; 
const TEMPLATE_REGEX = /@Template\[([^\]]+)\](\{[^\}]+\})?/g;
const CHECK_REGEX = /@Check\[([^\]]+)\](\{[^\}]+\})?/g;
const DC_REGEX = /DC\ ([0-9]{1,})/g;
const UUID_REGEXES = [
    {'regex': /@UUID\[(([a-zA-Z0-9\-\:\ \(\)\']+\.?){4,5})\]/g, 'replace': '<b data-compendium="$1">$3</b>'},
    {'regex': /@UUID\[(([a-zA-Z0-9\-\:\ \(\)\']+\.?){4,5})\]\{([\.a-zA-Z0-9\-\:\ \(\)\']+)\}/g, 'replace': '<b data-compendium="$1">$2</b>'}
];



class FoundryParser {
    #EN = null;
    #RE_EN = null;

    constructor(STATIC_EN, STATIC_RE_EN) {
        this.#EN = STATIC_EN;
        this.#RE_EN = STATIC_RE_EN;
    }

    parseItem(item) {
        if (!!this.hasDescription(item)) {
            if (!!item.system.description.value.includes('@Localize')) {
                const localize = this.getEN();
                const localize_re = this.getRE_EN();

                const localizeArray = item.system.description.value.matchAll(LOCALIZE_REGEX);

                let nextLocalize = localizeArray.next();
                while (!nextLocalize.done) {
                    
                    let localizeKeyArray = nextLocalize.value[1].split('.');
                    let newLocalString = null;
                    newLocalString = this.getLocalizedChild(localize, localizeKeyArray) || this.getLocalizedChild(localize_re, localizeKeyArray);

                    item.system.description.value = item.system.description.value.replace(nextLocalize.value[0], newLocalString);

                    nextLocalize = localizeArray.next();
                }
            }
            
            let newDescription = this.regexRemove(item.system.description.value);

            // item.system.parsedDescription = this.convertHTMLToObject(newDescription)
            return newDescription;
        }
    }

    regexRemove(description) {
        if (!!description) {
            if (!!description.includes('@Template')) {
                description = this.removeTemplateString(description);
            }
            if (!!description.includes('@Check')) {
                description = this.removeCheckString(description);
            }
            if (!!description.includes('DC')) {
                description = this.convertDCString(description);
            }

            Object.values(DAMAGE_REGEXES).forEach((r) => {
                if (!!r && !!r.regex && !!r.replace) {
                    description = this.replaceRegex(r.regex, r.replace, description);
                }
            });

            description = this.replaceRegex(TIME_REGEX.regex, TIME_REGEX.replace, description);

            if (!!description.includes('@UUID')) {
                Object.values(UUID_REGEXES).forEach((r) => {
                    if (!!r && !!r.regex && !!r.replace) {
                        description = this.replaceRegex(r.regex, r.replace, description);
                    }
                });
            }
        }
    
        return description
    }
   
    replaceRegex(regex, replace, description) {
        return description.replace(regex, replace)
    }
    
    // Template
    removeTemplateString(description) {
        let matches = description.matchAll(TEMPLATE_REGEX);
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
        let matches = description.matchAll(CHECK_REGEX);
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

    // DC
    convertDCString(description) {
        let matches = description.matchAll(DC_REGEX);
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

    hasDescription(item) {
        return !!item && !!item.system && !!item.system.description && !!item.system.description.value && item.system.description.value.length > 0 
    }

    getEN() {
        return this.#EN;
    }
    getRE_EN() {
        return this.#RE_EN;
    }
}

module.exports = FoundryParser;