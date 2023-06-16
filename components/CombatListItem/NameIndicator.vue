<template>
    <v-list-item-content>
        
        <v-fade-transition :group="true">
            <template v-if="!!initiated">
                <template v-if="showFullName">
                    <v-list-item-title :key="'member-title'">{{member.name}}</v-list-item-title>
                    <v-list-item-subtitle :key="'member-identifier'">{{member.identifier}}</v-list-item-subtitle>
                </template>
                <template v-else-if="showUniqueIdentifier">
                    <v-list-item-title :key="'member-title'">{{ uniqueOrAnonimizedName }}</v-list-item-title>
                    <v-list-item-subtitle :key="'member-identifier'">{{member.identifier}}</v-list-item-subtitle>
                </template>
                <template v-else-if="showUniqueNone">
                    <v-list-item-title :key="'member-title'">{{ uniqueOrAnonimizedName }}</v-list-item-title>
                    <v-list-item-subtitle :key="'member-identifier'">Unkown</v-list-item-subtitle>
                </template>
                <template v-else>
                    <v-list-item-title :key="'member-title'">{{ anonimizedName }}</v-list-item-title>
                    <v-list-item-subtitle :key="'member-identifier'">Unkown</v-list-item-subtitle>
                </template>
            </template>
        </v-fade-transition>
        <template v-if="!initiated">
            <v-list-item-title>
                <v-skeleton-loader
                    max-width="100"
                    height="14"
                    type="text"
                ></v-skeleton-loader>
            </v-list-item-title>
            <v-list-item-subtitle>
                <v-skeleton-loader
                    max-width="80"
                    height="14"
                    type="text"
                ></v-skeleton-loader>
            </v-list-item-subtitle>
        </template>
    </v-list-item-content>
</template>

<script>
import { isGM } from '@/services'

export default {
    data() {
        return {

        }
    },
    computed: {
        showFullName() {
            return !!this.member && !!isGM || (!!this.activeSettings && ((this.member.type == 'pc' || this.member.type == 'gmc') || (!!this.activeSettings.npcname && this.activeSettings.npcname == this.$rsd.settings.getIndex('npcname', 'full'))))
        },
        showUniqueIdentifier() {
            return !!this.member && !!this.activeSettings && (!!this.activeSettings.npcname && this.activeSettings.npcname == this.$rsd.settings.getIndex('npcname', 'identifier and unique id'))
        },
        showUniqueNone() {
            return !!this.member && !!this.activeSettings && (!!this.activeSettings.npcname && this.activeSettings.npcname == this.$rsd.settings.getIndex('npcname', 'unique id'))
        },
        uniqueOrAnonimizedName() {
            return !!this.member && ((!!this.member.object && !this.member.object.name) || (!!this.member.object && !!this.member.object.name && this.member.name != this.member.object.name)) ? this.member.name : this.anonimizedName
        },
        anonimizedName() {
            return !!this.member ? `Combatant - ${this.member.id.substr(0,3)}` : 'Combatant'
        }
    },
    props: {
        member: Object,
        initiated: Boolean,
    },
}
</script>
