<template>
    <v-list-item
        link 
        class="pl-2 pr-4 py-1 no-flex accent-item"
        :class="initiative.class(member, index)"
        @click="initiative.click($event, member, index)"
        @contextmenu="initiative.contextmenu($event, member, index)" 
    >
        <v-list-item-icon class="mr-2">
            <v-chip
                label
                class="px-0 justify-center"
                style="width:32px;"
                :style="!!member.color ? GameIcons.get.color(member.color) + 'bottom:1px;' : ''"
                :ripple="false"
                @click="openCombatInitiativeDialog(member, index)"
                @click.stop
            >
                <span
                    :style="!!member.color ? $rsd.format.getContrastColor(member.color, rsd.darkmode) : ''"
                >{{member.initiative}}</span>
            </v-chip>
        </v-list-item-icon>
        <NameIndicator :member="member" :initiated="isInitiated" />
        <v-list-item-action class="py-0 d-flex flex-row align-center">
            <HealthIndicator :member="member" :index="index" :localCharacter="localCharacter" :initiative="initiative" />
        </v-list-item-action>
    </v-list-item>
</template>

<script>
import { isGM } from '@/services'

import HealthIndicator from './HealthIndicator.vue'
import NameIndicator from './NameIndicator'

export default {
    components: { 
        HealthIndicator,
        NameIndicator,
    },
    data() {
        return {
            combatantTimer: null,
            refreshKey: 0,
            initiated: false,
            maxCombatantTimer: 20,
        };
    },
    props: {
        member: Object,
        index: Number,
        initiative: Object,
        localCharacter: Object,
    },
    computed: {
        isInitiated() {
            return !!this.initiated && !this.refresh
        }
    },
    methods: {
        openCombatInitiativeDialog(member, index) {
            if (!!member && !!member.id) {
                if (!!isGM || (!!this.localCharacter && !!this.localCharacter.id && this.localCharacter.id == member.id)) {
                    this.$rsd.dialog.open({name: 'combatInitiativeDialog', attrs: [true, {...member, id: member.id}]})
                }
            }
        },
    },
    mounted() {
        this.combatantTimer = setInterval(() => {
            this.refreshKey++

            let nullCheck = true
            if (!this.member || !this.member.basestats) {
                nullCheck = false
            }

            if (this.refreshKey == this.maxCombatantTimer || !!nullCheck) {
                clearInterval(this.combatantTimer)
                this.initiated = true
            }
        }, 500)
    }
}
</script>
