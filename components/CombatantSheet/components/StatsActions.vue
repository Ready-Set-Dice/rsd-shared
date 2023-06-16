<template>
    <span v-if="!!actions">
        <span 
            v-for="(action, index) in actions"
            :key="'action-'+action.name"
            class="d-block"
        >
            <span 
                class="font-weight-bold" 
                :class="!!processDescription(action) && processDescription(action).length > 1 ? 'pointer' : null"
                @click="!!processDescription(action) && processDescription(action).length > 1 ? toggleOpen(index) : null"
            >
                {{$rsd.format.capitalize(action.name)}}
                <span v-if="hasActionNumber(action)" class="action">
                    {{actionNumber(action)}}
                </span>
                <v-icon 
                    class="ml-n2"
                    :class="!open[index] ? 'mt-n1 mb-1' : ''"
                    v-if="!!processDescription(action) && processDescription(action).length > 1"
                >{{!!open[index] ? 'mdi-menu-down' : 'mdi-menu-up'}}</v-icon>
            </span>
            <!-- <span v-show="!!open[index]" v-html="processDescription(action)" class="actions-description"></span> -->
            <span v-show="!!open[index]" class="actions-description">
                <span
                    v-for="(item, index) in processDescription(action)"
                    :key="'node-'+index"
                >
                    <BaseItemNode :item="item" :modifier="modifier" />
                </span>
            </span>
            <span v-show="!open[index]" class="actions-description">
                <span>
                    <BaseItemNode :item="getFirstNode(action)" :modifier="modifier"/>
                </span>
            </span>
        </span>
    </span>
</template>

<script>
import BaseItemNode from '@/../../shared/components/base/BaseItemNode'

export default {
    data() {
        return {
            open: [],
        }
    },
    props: {
        actions: Array,
        passive: Boolean,
        startOpen: Boolean,
        modifier: Number,
    },
    components: {
        BaseItemNode,
    },
    created() {
        if (!!this.actions && Object.keys(this.actions).length > 0) {
            Object.keys(this.actions).forEach(index => {
                if (!!this.startOpen) {
                    this.open[index] = true
                } else if (!!this.actions[index] && !!this.actions[index].system && !!this.actions[index].system.actionType &&
                !!this.actions[index].system.actionType.value && this.actions[index].system.actionType.value == 'passive' &&
                !this.descriptionHasDC(this.actions[index])) {
                    this.open[index] = true
                }
                
            })
        }
    },
    methods: {
        hasActionNumber(action) {
            return !!action && !!action.system && !!action.system.actionType && !!action.system.actionType.value && (action.system.actionType.value == 'action' || action.system.actionType.value == 'reaction')
        },
        toggleOpen(index) {
            this.$set(this.open, index, !this.open[index])
        },
        actionNumber(action) {
            return action.system.actionType.value == 'action' 
            ? (!!action.system.actions.value ? action.system.actions.value : 1) 
            : (
                action.system.actionType.value == 'reaction' 
                ? 'r'
                : null
            )
        },
        processDescription(action) {
            let description = !!action.system && !!action.system.parsedDescription ? action.system.parsedDescription : null
            return description
        },
        getFirstNode(action) {
            let description = this.processDescription(action)
            return !!description && description.length > 0 ? description[0] : null
        },
        descriptionHasDC(action) {
            let description = !!action.system && !!action.system.description && !!action.system.description.value ? action.system.description.value : null
            return !!description && description.toLowerCase().includes('dc')
        },
    }
}
</script>

<style scoped>
span >>> span.actions-description p {
    margin-bottom: 0 !important;
}
</style>