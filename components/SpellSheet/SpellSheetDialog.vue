<template>
    <v-dialog
        v-model="visible"
        :fullscreen="!!SMDown"
        :content-class="!!MDUp ? 'spell-dialog' : ''"
    >
        <v-card>
            <SpellSheet 
                :spell="spell"
                :visible="visible"
                :containerClass="containerClass"
            />
            <v-btn v-if="!!usable && !always" :disabled="!available" tile class="ma-2" @click="spend()">
                Spend spellslot
            </v-btn>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="visible = false"
              >Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import SpellSheet from './SpellSheet.vue'

export default {
    components: {
        SpellSheet,
    },
    data() {
        return {
            always: false,
            available: false,
            containerClass: '',
            entry: null,
            focus: false,
            spell: null,
            visible: false,
        }
    },
    props: {
        usable: Boolean,
        cuid: String,
    },
    computed: {
        isAvailable() {

        }
    },
    methods: {
        show(spell, info) {
            console.log('info', info)
            this.spell = spell
            this.available = info.available
            this.entry = info.entry
            this.focus = info.focus
            this.always = info.always
            this.visible = true

            // this.$store.dispatch('rsd/clearCombatUsedSpellSlot')
        },
        spend() {
            this.visible = false
            if (!!this.spell && !!this.cuid && !!this.entry && !this.always) {
                if (!!this.focus) {
                    this.$store.dispatch('rsd/pushCombatUsedSpellSlot', {cuid: this.cuid, focus: true})
                } else {
                    this.$store.dispatch('rsd/pushCombatUsedSpellSlot', {cuid: this.cuid, entry: this.entry, spell: this.spell._id})
                }
                // this.$store.dispatch('rsd/pushCombatUsedSpellSlot', {cuid: this.cuid, sid: this.spell._id})
            }
        }
    }
}
</script>