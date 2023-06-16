class ClassParser {
    constructor() {}

    init() {
        this.ignoreNodes = false
        this.lockedIgnore = false
    }

    parseClass(clss) {

        clss.system.mechanicsDescription = this.convertHTMLToObject(clss.system.foundryDescription.value)
    
        return clss
    }

    convertHTMLToObject(html) {
        this.ignoreNodes = false
        this.lockedIgnore = false

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
                            if (child.data.toLowerCase().includes('initial proficiencies') && !this.lockedIgnore) {
                                this.ignoreNodes = false
                                this.lockedIgnore = true
                            }
                            
                            if (!this.ignoreNodes) {
                                result.push({
                                    type: 'TEXT',
                                    data: child.data
                                })
                            }

                            if (child.data.toLowerCase().includes('roleplaying')) {
                                this.ignoreNodes = true
                            }
                            if (child.data.toLowerCase().includes('class features')) {
                                this.ignoreNodes = true
                            }
                        }
                    } else if (!!child && child.nodeName == "P") {
                        const children = this.parseChildNode(child)
                        if (!this.ignoreNodes) {
                            result.push({
                                type: 'P-MB-0',
                                children: children
                            })
                        }
                    } else if (!!child && child.nodeName == "HR") {
                        if (!this.ignoreNodes) {
                            result.push({
                                type: 'HR'
                            })
                        }
                    } else if (!!child && child.nodeName == "H2") {
                        const children = this.parseChildNode(child)
                        if (!this.ignoreNodes) {
                            result.push({
                                type: 'H2',
                                children: children
                            })
                        }
                    } else if (!!child && child.nodeName == "EM") {
                        const children = this.parseChildNode(child)
                        if (!this.ignoreNodes) {
                            result.push({
                                type: 'EM',
                                children: children
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

export default new ClassParser()