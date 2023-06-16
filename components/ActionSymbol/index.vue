<template>
    <span v-if="displayAbility" class="action">
        {{abilityType()}}
    </span>
</template>

<script>
export default {
    props: {
        ability: Object
    },
    computed: {
        displayAbility() {
            return !!this.ability && !!this.ability.system && !!this.ability.system.actionType && !!this.ability.system.actionType.value
        },
    },
    methods: {
        abilityType() {
            return this.ability.system.actionType.value == 'action' 
            ? (!!this.ability.system.actions.value ? this.ability.system.actions.value : 1) 
            : (
                this.ability.system.actionType.value == 'reaction' 
                ? 'r'
                : null
            )
        }
    }
}
</script>