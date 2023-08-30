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
            tmpl: {
                labels: {
                    edit: {
                        title: 'Recovery check',
                        button: 'Submit'
                    }
                },
                inputs: {
                    dc: {
                        label: "Recovery DC",
                        type: "number",
                        min: 1,
                        max: 20,
                        required: true,
                        rule: 'levelNumber',
                        extra: {},
                    },
                    check: {
                        label: "Recovery Check",
                        type: "number",
                        min: 1,
                        max: 20,
                        required: true,
                        rule: 'levelNumber',
                        extra: {},
                    },
                    roll: {
                        label: "Roll recovery check",
                        type: "button",
                        bonus: 0,
                        click: () => {
                            if (!!this.$refs && !!this.$refs.dialog) {
                                let roll = Math.floor(Math.random() * 20 + 1)
                                console.log(roll)
                                this.$refs.dialog.setOption("check",roll)
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
                if (!!options && !!options.receiver.name) {
                    this.tmpl.labels.edit.subtitle = options.receiver.name
                }
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options)
            }
        },
        save(options) {
            // this.$emit('Save', options)
            this.$rsd.combat.processRecoveryCheck(options)
        }
    }
}
</script>