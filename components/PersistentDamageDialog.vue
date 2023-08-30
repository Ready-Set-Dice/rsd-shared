<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
    />
</template>

<script>
import BaseDialog from '@/../../.shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            checkInputs: [],
            checkInfo: {},
            tmpl: {
                labels: {
                    new: {
                        title: 'Persistent damage'
                    },
                    edit: {
                        title: 'Persistent damage',
                        button: 'Perform check'
                    }  
                },
                inputs: {
                    pdheader: {
                        header: "Default flat DC is 15",
                        type: 'text',
                    },
                    checkroll: {
                        label: "Roll for all checks",
                        type: "button",
                        click: () => {
                            if (!!this.$refs && !!this.$refs.dialog && !!this.checkInputs) {
                                Object.values(this.checkInputs).forEach(c => {
                                    let roll = Math.floor(Math.random() * 20 + 1)
                                    this.$refs.dialog.setOption(c+"-check",roll)
                                })
                            }
                        }
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.resetCheckInputs()

                if (!!options) {
                    if (!!options.name) {
                        // this.tmpl.labels.edit.title = 'Persistent damage - ' + options.name
                        this.tmpl.labels.edit.subtitle = options.name
                    }
                }
                if (!!extra) {
                    // console.log("extra",extra)
                    if (!!extra.conditions) {
                        Object.values(extra.conditions).forEach(c => {
                            // console.log('c', c)
                            if (!!c && !!c.type && c.type.toLowerCase() == 'persistent damage') {
                                // console.log(c)
                                this.checkInputs.push(c.dmg.toLowerCase())
                                this.checkInfo[c.dmg.toLowerCase()] = c.value

                                this.tmpl.inputs[c.dmg.toLowerCase()+'-check'] = {
                                    label: `${c.value} ${c.dmg} damage - check`,
                                    min: 1,
                                    max: 20,
                                    type: "number",
                                    rule: 'smallNumber',
                                    extra: {},
                                }

                                this.tmpl.inputs[c.dmg.toLowerCase()+'-dc'] = {
                                    label: `${c.dmg} - DC`,
                                    min: 1,
                                    max: 20,
                                    type: "number",
                                    rule: 'smallNumber',
                                    extra: {},
                                }

                                options[c.dmg.toLowerCase()+'-check'] = 1
                                options[c.dmg.toLowerCase()+'-dc'] = 15
                                options[c.dmg.toLowerCase()+'-cid'] = c.id
                            }
                        })
                    }

                    // Object.values(extra.damage).forEach(d => {
                }

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            const processed = this.processOptions(options)
            this.$rsd.combat.processPersistentDamageCheck(processed)
        },
        processOptions(options) {
            options.checks = {}
            options.dc = {}
            options.cid = {}
            options.damage = this.checkInfo
            this.checkInputs.forEach(ci => {
                // delete this.tmpl.inputs[ci]
                options.checks[ci] = options[ci+'-check']
                options.dc[ci] = options[ci+'-dc']
                options.cid[ci] = options[ci+'-cid']

                delete options[ci+'-dc']
                delete options[ci+'-check']
                delete options[ci+'-cid']
            })

            delete options.name

            return options
        },
        resetCheckInputs() {
            if (!!this.checkInputs && this.checkInputs.length > 0) {
                this.checkInputs.forEach(ci => {
                    delete this.tmpl.inputs[`${ci}-check`]
                    delete this.tmpl.inputs[`${ci}-dc`]
                })
                this.checkInputs = []
                this.checkInfo = {}
            }
        },
    }
}
</script>