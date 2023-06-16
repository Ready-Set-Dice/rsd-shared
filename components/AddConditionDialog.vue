<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Remove="remove"
    >
        <template v-slot:append-slot>
            <div v-show="!!isImmune" class="pt-3 red--text font-weight-medium">
                <span>Note, this creature is immune to being {{ type }}.</span>
            </div>
        </template>
    </BaseDialog>
</template>

<script>
import { isGM } from '@/services'
import BaseDialog from '@/../../shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            isImmune: false,
            type: '',
            tmpl: {
                removeButton: true,
                hideFinish: true,
                name: 'condition-dialog',
                labels: {
                    new: {
                        title: 'Add Condition'
                    },
                    edit: {
                        title: 'Edit Condition'
                    }  
                },
                inputs: {
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}, extra = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.isImmune = extra.immune || false

                if (!!options) {
                    const type = this.$rsd.format.capitalize(options.type)
                    this.tmpl.labels.new.title = 'Add ' + type
                    this.tmpl.labels.edit.title = 'Edit ' + type

                    this.type = options.type
                }
                this.$refs.dialog.show(edit, options, true)
            }
        },
        remove(options) {
            if (!!options && !!options.type && !!options.id && (!!options._key || options._key == 0)) {
                const data = {id: options.id, type: options.type}
                if (!!options.local) {
                    if (!!isGM) {
                        this.$rsd.members.removeCondition(options._key, options.memberType, data)
                    } else {
                        this.$rsd.playercharacters.removeCondition(options._key, data)
                    }
                } else {
                    this.$rsd.combat.removeCondition(options._key, data)
                }
            }
        },
    }
}
</script>