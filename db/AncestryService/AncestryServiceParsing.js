class AncestryParser {
    constructor() {}

    init() {
        this.ignoreNodes = true
    }

    parseAncestry(ancestry) {

        ancestry.system.mechanicsDescription = this.convertHTMLToObject(ancestry.system.foundryDescription.value)
    
        return ancestry
    }

    convertHTMLToObject(html) {
        this.ignoreNodes = true

        let el = document.createElement('div')
        el.innerHTML = html

        let object = this.parseChildNode(el)

        if (Object.keys(object).length >= 1 && object[0].type == 'P') {
            object[0].type = 'SPAN'
        }

        // console.log('object', object)

        return object
        // console.log(el)
        // console.log(el.children)
    }

    parseChildNode(node) {
        let result = []

        if (!!node) {

            if (!!node.childNodes && !!node.childNodes.length > 0) {
                node.childNodes.forEach(child => {
                    if (!!child && child.nodeName == '#text') {
                        if (child.data != '\n') {
                            if (!this.ignoreNodes) {
                                result.push({
                                    type: 'TEXT',
                                    data: child.data
                                })
                            }

                            if (child.data.toLowerCase().includes('mechanics')) {
                                this.ignoreNodes = false
                            }
                        }
                    } else if (!!child && child.nodeName == "P") {
                        const children = this.parseChildNode(child)
                        if (!this.ignoreNodes) {
                            result.push({
                                type: 'P-MB-1',
                                children: children
                            })
                        }
                    } else if (!!child && child.nodeName == "HR") {
                        if (!this.ignoreNodes) {
                            result.push({
                                type: 'HR'
                            })
                        }
                    } else if (!!child) {
                        const children = this.parseChildNode(child)
                        if (!this.ignoreNodes) {
                            result.push({
                                type: child.nodeName,
                                children: children
                            })
                        }
                    }
                    
                })
            }
        }

        // console.log('result', result)

        return result
    }

}

export default new AncestryParser()