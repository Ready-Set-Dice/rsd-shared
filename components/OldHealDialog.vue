<template>
    <GenericDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @OnChange="onChange"
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
                class: 'heal-dialog',
                labels: {
                    edit: {
                        title: 'Heal',
                        button: 'Perform heal'
                    }
                },
                inputs: {
                    healthbar: {
                        type: 'progress',
                        label: 'Target health',
                        value: 100
                    },
                    type: {
                        label: "Heal type",
                        type: "choice",
                        choices: ['HP', 'Temp HP']
                    },
                    amount: {
                        label: "Amount of healing",
                        type: "number",
                        min: 1,
                        max: 1000,
                        rule: 'largeNumber',
                        extra: {},
                    },
                    duration: {
                        type: 'number',
                        label: 'Rounds (0 is permanent)',
                        locked: true,
                        min: 0,
                        max: 50,
                        extra: {},
                        rule: 'tinyNumberWithZero',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra) {
            if (!!this.$refs && !!this.$refs.dialog) {
                if (!!options && !!options.receiver) { 
                    // this.tmpl.labels.edit.title = 'Heal - ' + options.receiver.name
                    this.tmpl.labels.edit.subtitle = options.receiver.name

                    if (!!extra && !!extra.health) {
                        this.tmpl.inputs.healthbar.label = this.tmpl.inputs.healthbar.label = `${options.receiver.name}'s health points (${extra.health.hp}/${extra.health.maxhp})${!!extra.health.temphp ? ` + temporary (${extra.health.temphp})` : ''}`
                        this.tmpl.inputs.healthbar.value = 100*((extra.health.hp + (extra.health.temphp || 0))/extra.health.maxhp)
                        this.tmpl.inputs.amount.max = extra.health.maxhp
                    }

                    options['amount'] = 1
                    options['duration'] = 0
                }

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            options.temp = !!options.type
            if (!options.temp) {
                delete options.duration
                delete options.temp
            }
            delete options.type

            this.$emit('Save', options)
        },
        onChange(options) {
            if (options.type == 1) {
                this.tmpl.inputs.duration.locked = false
            } else {
                this.tmpl.inputs.duration.locked = true
            }
        },
        close() {
            this.$emit('Close')
        },
    }
}
</script>