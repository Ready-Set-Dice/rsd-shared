<template>
    <GenericDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="close"
        @Close="close"
    />
</template>

<script>
import GenericDialog from '@/../../.shared/components/GenericDialog/index'

export default {
    components: {
        GenericDialog,
    },
    data() {
        return {
            tmpl: {
                class: 'skill-check-dialog',
                labels: {
                    edit: {
                        title: 'Skill check',
                        button: 'close'
                    }  
                },
                inputs: {
                    header: {
                        header: `Skill check for combatant`,
                        type: 'text',
                    },
                    skillcheck: {
                        label: "Skill check",
                        min: 1,
                        max: 20,
                        type: "number",
                        extra: {},
                    },
                    skillcheckroll: {
                        label: "Roll for skill",
                        type: "button",
                        bonus: 0,
                        click: () => {
                            if (!!this.$refs && !!this.$refs.dialog) {
                                let diceroll = Math.floor(Math.random() * 20 + 1)
                                if (diceroll == 1) {
                                    this.$rsd.dialog.open({name: 'snackbarManager', attrs: [
                                        'Natural 1!',
                                        'One degree worse of success.'
                                    ]})
                                    this.tmpl.inputs.skillcheck.class = 'red--text'
                                } else if (diceroll == 20) {
                                    this.$rsd.dialog.open({name: 'snackbarManager', attrs: [
                                        'Natural 20!',
                                        'One degree better of success!'
                                    ]})
                                    this.tmpl.inputs.skillcheck.class = 'green--text'
                                } else {
                                    this.tmpl.inputs.skillcheck.class = ''
                                }
                                let roll = diceroll + this.tmpl.inputs.skillcheckroll.bonus
                                this.$refs.dialog.setOption("skillcheck",roll)
                            }
                        },
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = null, extra = null) {
            if (!!this.$refs && !!this.$refs.dialog) {
                if (!!extra) {
                    if (!!extra.name && extra.skill) {
                        this.tmpl.inputs.header.header = `${extra.skill} check for ${extra.name}`
                    }
                    if (!!extra.skillmod) {
                        this.tmpl.inputs.skillcheckroll.bonus = extra.skillmod
                        this.tmpl.inputs.skillcheck.label = `Skill check (${extra.skillmod >= 0 ? '+' : ''}${extra.skillmod})`
                        this.tmpl.inputs.skillcheck.min = 1 + extra.skillmod
                        this.tmpl.inputs.skillcheck.max = 20 + extra.skillmod
                    }
                }

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        close() {
            this.$emit('Close')
        },
    }
}
</script>