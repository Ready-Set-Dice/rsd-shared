export default {
    methods: {
        doFilterCommand(filteredCommands, filterItems, text, parts, meta = null) {
            const command = filteredCommands.find(c => c.includes(text))
            if (!!command && command.length > text.length) {
                if (filteredCommands[filteredCommands.length-1] == command) {
                    this.details = true
                }
                let values = null

                if (!!meta) {
                    if (!!meta.isNumber) {
                        values = this.getNumbersValue(command)
                    } else if (!!meta.isText || !!meta.isTextArray) {
                        values = this.getTextValues(command)
                    } else if (!!meta.isBoolean) {
                        values = this.getBooleanValues(command)
                    } else {
                        values = this.getExactValues(command)

                        console.log(filteredCommands, filterItems, text, parts, meta, values)
                    }
                } else {
                    values = this.getExactValues(command)
                }

                if (!!values && values.length > 0) {
                    filterItems = filterItems.filter(s => {
                        let result = false
                        if (!!s) {
                            let field = s
                            let hasField = true
                            parts.forEach(fp => {
                                if (!!field && !!field[fp] && !!hasField) {
                                    field = field[fp]
                                } else if (!!meta && !!meta.isBoolean && !!field && !!hasField && typeof(field[fp]) == 'boolean') {
                                    field = field[fp]
                                } else {
                                    field = null
                                    hasField = false
                                }
                            })

                            if (!!meta) {
                                if (!!meta.isNumber) {
                                    field = Number(field)
                                }
                            }

                            if (!!field || (!!meta && !!meta.check && !!meta.check(field)) || (!!meta && !!meta.isBoolean)) {
                                values.forEach(v => {
                                    if (!!meta) {
                                        if (!!meta.isNumber) {
                                            if (field == v) {
                                                result = true
                                            }
                                        } else if (!!meta.isText) {
                                            if (!!v.exact && field.toLowerCase() == v.value.toLowerCase()) {
                                                result = true
                                            } else if (!v.exact) {
                                                const reg = new RegExp(v.value)
                                                const match = field.toLowerCase().match(reg)

                                                if (!!match) {
                                                    result = true
                                                }
                                            }
                                        } else if (!!meta.isBoolean) {
                                            result = field == v
                                        } else if (!!meta.isTextArray) {
                                            if (!!field && field.length > 0) {
                                                field.forEach(fv => {
                                                    if (!!v.exact && fv.toLowerCase() == v.value.toLowerCase()) {
                                                        result = true
                                                    } else if (!v.exact) {
                                                        const reg = new RegExp(v.value)
                                                        const match = fv.toLowerCase().match(reg)

                                                        if (!!match) {
                                                            result = true
                                                        }
                                                    }
                                                })   
                                            }
                                        } else if (!!meta.isCustomWithValues) {
                                            if (!!field.value && field.value.length > 0) {
                                                field.value.forEach(fv => {
                                                    if (fv.toLowerCase().includes(v.toLowerCase())) {
                                                        result = true
                                                    }
                                                })
                                            } else if (!!field.custom && field.custom.toLowerCase() == v.toLowerCase()) {
                                                result = true
                                            }
                                        } else if (!!meta.isExact) {
                                            if (!!field) {
                                                if (typeof(field) == 'object' && field.length > 0) {
                                                    field.forEach(fv => {
                                                        if (fv.toLowerCase() == v.toLowerCase()) {
                                                            result = true
                                                        }
                                                    })
                                                } else if (typeof(field) == 'string') {
                                                    if (field.toLowerCase() == v.toLowerCase()) {
                                                        result = true
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (!!field) {
                                            if (typeof(field) == 'object' && field.length > 0) {
                                                field.forEach(fv => {
                                                    if (fv.toLowerCase().includes(v.toLowerCase())) {
                                                        result = true
                                                    }
                                                })
                                            } else if (typeof(field) == 'string') {
                                                if (field.toLowerCase().includes(v.toLowerCase())) {
                                                    result = true
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        return result
                    })
                }
            }
            return filterItems
        },
        
        getTextValues(command) {
            let result = []

            if (!!command.includes('*') && !!command.match(/[a-zA-Z\-]+:\"([a-zA-Z0-9\ \,\.\-\(\)\'\*\#]+)\"/g)) {
                let matchTerm = command.replace(/[a-zA-Z\-]+:\"(.+)\"/g,"$1")
                matchTerm = !!matchTerm && matchTerm.length > 0 ? matchTerm.replaceAll('*', `[a-zA-Z0-9\\ \\,\\.\\-\\(\\)\\'\\#]{0,}`) : null

                if (!!matchTerm && matchTerm.length > 0) {
                    result.push({value: matchTerm})
                }
            } else if (!!command.match(/[a-zA-Z\-]+:\"([a-zA-Z0-9\ \,\.\-\(\)\'\#]+)\"/g)) {
                const value = command.replace(/[a-zA-Z\-]+:\"([a-zA-Z0-9\ \,\.\-\(\)\'\#]+)\"/g,"$1")
                if (!!value) { result.push({exact: true, value: value}) }
            }

            return result
        },

        getBooleanValues(command) {
            let result = []

            if (!!command.match(/[a-zA-Z\-]+:true/g)) {
                result.push(true)
            } else if (!!command.match(/[a-zA-Z\-]+:false/g)) {
                result.push(false)
            }

            return result
        },

        getExactValues(command) {
            let result = []
            
            if (!!command.match(/[a-zA-Z\-]+:\[([a-z,]+)\]?/g)) {
                const values = command.replace(/[a-zA-Z\-]+:\[([a-zA-Z,]+)\]?/g,"$1").split(',')
                if (!!values && values.length > 0) { result = result.concat(values) }
            } else if (!!command.match(/[a-zA-Z\-]+:([a-zA-Z]+)/g)) {
                const value = command.replace(/[a-zA-Z\-]+:([a-zA-Z]+)/g,"$1")
                if (!!value) { result.push(value) }
            }

            return result
        },

        getNumbersValue(command) {
            let result = []

            if (!!command.match(/[a-zA-Z\-]+:([0-9]{1,2})/g)) {
                const value = Number(command.replace(/[a-zA-Z\-]+:([0-9]{1,2})/g,"$1"))
                if (!!value || value == 0) { result.push(value) }
            } else if (!!command.match(/[a-zA-Z\-]+:([\(\[])([0-9]{1,2})..([0-9]{1,2})([\)\]])/g)) {
                for (const values of command.matchAll(/[a-zA-Z\-]+:([\(\[])([0-9]{1,2})..([0-9]{1,2})([\)\]])/g)) {
                    if (!!values && values.length == 5) {
                        const lower = Number(values[2])
                        const upper = Number(values[3])
                        const lowerInclude = !!values[1] && values[1] == '['
                        const upperInclude = !!values[1] && values[4] == ']'

                        if ((!!lower || lower == 0) && (!!upper || upper == 0)) { // Verify they are numbers
                            if (lower < upper) {
                                let min = !!lowerInclude ? lower : lower+1
                                let max = !!upperInclude ? upper+1 : upper

                                for(let i = min; i < max; i+=1) {
                                    result.push(i)
                                }
                            }
                        }
                    }
                }
            } else if (!!command.match(/[a-zA-Z\-]+([\<\>\=]{1,2})([0-9]{1,2})/g)) {
                for (const values of command.matchAll(/[a-zA-Z\-]+([\<\>\=]{1,2})([0-9]{1,2})/g)) {
                    if (!!values && values.length == 3) {
                        const value = Number(values[2])
                        const symbol = values[1]

                        if (symbol == '=') {
                            result.push(value)
                        } else if (symbol == '>' || symbol == '>=') {
                            if (symbol == '>=') { result.push(value) }
                            for(let i = value+1; i<=10; i+=1) {
                                result.push(i)
                            }
                        } else if (symbol == '<' || symbol == '<=') {
                            if (symbol == '<=') { result.push(value) }
                            for(let i = value-1; i>=0; i-=1) {
                                result.push(i)
                            }
                        }
                    }
                }
            }

            return result
        },
    }
}