<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
    />
</template>

<script>
import BaseDialog from '@root/.shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    props: {
        combat: Boolean,
    },
    data() {
        return {
            tmpl: {
                name: 'encounter-style-dialog',
                labels: {
                    new: {
                        title: 'Edit note'
                    },
                    edit: {
                        title: 'Edit note'
                    }  
                },
                inputs: {
                    note: {
                        label: "Note",
                        type: "string",
                        counter: 128,
                        note: 'note',
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }

            if (!!options) {
                this.$rsd.combat.updateMember(options.id, {note: options.note.slice(0, 128)})
            }

            // this.$emit('Save', options)
        }
    }
}
</script>