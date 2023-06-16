<template>
    <div class="ml-n1" v-if="!!combatant">
        <v-btn icon tile small @click="openNoteDialog">
            <v-icon>{{!!combatant.note ? 'mdi-note-edit' : 'mdi-note-plus'}}</v-icon>
        </v-btn>
        <span v-if="!!combatant.note">{{ combatant.note }}</span>

        <CombatNoteDialog ref="combatNoteDialog" />
    </div>
</template>

<script>
import CombatNoteDialog from './CombatNoteDialog.vue'

export default {
    components: {
        CombatNoteDialog,
    },
    data() {
        return {

        }
    },
    props: {
        combatant: Object,
    },
    methods: {
        openNoteDialog() {
            if (!!this.combatant) {
                this.getDialog('combatNoteDialog').show(true, {...this.combatant})
            }
        }
    }
}
</script>