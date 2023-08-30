<template>
    <GenericDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @Close="close"
    />
</template>

<script>
import GenericDialog from '@root/.shared/components/GenericDialog/index'

export default {
    components: {
        GenericDialog,
    },
    data() {
        return {
            tmpl: {
                class: 'damage-dialog',
                labels: {
                    edit: {
                        title: 'Damage'
                    }  
                },
                inputs: {
                    header: {
                        header: 'Damage done by:',
                        type: 'text',
                    },
                    healthbar: {
                        type: 'progress',
                        label: 'Target health',
                        value: 100
                    },
                    critical: {
                        type: 'choice',
                        choices: ['Normal', 'Critical'],
                        label: 'Type of attack',
                    },
                    dmg: {
                        type: 'select',
                        items: ['Untyped'],
                        label: 'Type of damage',
                    },
                    amount: {
                        label: "Amount of damage",
                        type: "number",
                        extra: {},
                        min: 1,
                        max: 1000,
                        rule: 'largeNumber',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!this.$refs && !!this.$refs.dialog) {
                if (!!options) {
                    this.tmpl.inputs.dmg.items = ['Untyped']

                    if (!!options.instigator) {
                        this.tmpl.inputs.header.header = 'Damage done by: ' + options.instigator.name
                    } else {
                        this.tmpl.inputs.header.header = ''
                    }
                    if (!!options.receiver) {
                        this.tmpl.labels.edit.subtitle = options.receiver.name
                    }
                    if (!!extra) {
                        if (!!extra.health.maxhp) {
                            this.tmpl.inputs.amount.max = extra.health.maxhp*2;
                        }

                        if (!!extra.health) {
                            this.tmpl.inputs.healthbar.label = `${options.receiver.name}'s health points (${extra.health.hp}/${extra.health.maxhp})${!!extra.health.temphp ? ` + temporary (${extra.health.temphp})` : ''}`
                            this.tmpl.inputs.healthbar.value = 100*((extra.health.hp + (extra.health.temphp || 0))/extra.health.maxhp)
                        }

                        if (!!extra.immunities || !!extra.weaknesses || !!extra.resistances) {
                            this.tmpl.inputs.healthbar.label += '<br />'
                            if (!!extra.immunities) {
                                this.tmpl.inputs.healthbar.label += `<b>Immunities</b> ${extra.immunities};<br/>`
                            }
                            if (!!extra.weaknesses) {
                                this.tmpl.inputs.healthbar.label += `<b>Weaknesses</b> ${extra.weaknesses};<br/>`
                            }
                            if (!!extra.resistances) {
                                this.tmpl.inputs.healthbar.label += `<b>Resistances</b> ${extra.resistances}`
                            }
                        }

                        if (!!extra.dmgtypes && extra.dmgtypes.length > 0) {
                            extra.dmgtypes.forEach(dt => {
                                this.tmpl.inputs.dmg.items.push(dt)
                            })
                        }
                    }

                    options['amount'] = 1
                    options['dmg'] = 'Untyped'
                }

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            options.critical = !!options.critical
            options.dmg = options.dmg.toLowerCase()

            this.$emit('Save', options)
        },
        close() {
            this.$emit('Close')
        },
    }
}
</script>