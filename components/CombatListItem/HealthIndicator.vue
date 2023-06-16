<template>
    <!-- TODO: Refactor to include npc health option -->
    <v-btn
        class="my-n1 ml-1"
        icon
        tile
        small
        outlined
        @click="openHealthDialog(member, index)"
        @click.stop
        @contextmenu="openDamageDialog($event, member, index)"
        @contextmenu.stop
        v-show="!!isGM || member.type != 'npc'"
    >
        <template v-if="showFull">
            <v-icon
                class="icon_color--text text--lighten-3"
                :style="'position: absolute; top:-1px; left: 1px; font-size:2.6em;'"
            >mdi-heart</v-icon>
            <span
                :style="'position:relative; top:0px'"
                class="text-body-2"
                :class="!!rsd.darkmode ? 'inverse--text' : 'icon_color--text'"
            >{{!!member.health ? member.health.hp + member.health.temphp : 'x'}}</span>
        </template>
        <template v-else-if="showPartial">
            <v-icon
                :style="'position: absolute; top:-11px; left: 1px; font-size:2.6em;'"
                :color="healthColor"
            >mdi-heart</v-icon>
        </template>
    </v-btn>
</template>

<script>
import { isGM } from '@/services'

export default {
    data() {
        return {

        }
    },
    computed: {
        isGM() {
            return isGM
        },
        showFull() {
            return !!isGM || (!!this.localCharacter && !!this.localCharacter.id && this.localCharacter.id == this.member.id) || (!!this.activeSettings && (!!this.activeSettings.pchp && this.activeSettings.pchp == this.$rsd.settings.getIndex('pchp', 'full')))
        },
        showPartial() {
            return !!this.activeSettings && (!!this.activeSettings.pchp && this.activeSettings.pchp == this.$rsd.settings.getIndex('pchp', 'partial'))
        },
        healthColor() {
            // let healthObj = this.Combat.Members().get.health.byID(id)

            if (!!this.member.health && !!this.member.health.hp && !!this.member.health.maxhp) {
                
                let percentConstant = 100 / Math.max(this.member.health.maxhp, this.member.health.hp)
                let hpPercent = this.member.health.hp * percentConstant / 100

                // console.log("hpPercent", hpPercent)
                // console.log(`${healthObj.maxhp}, ${healthObj.hp} * ${percentConstant} / 100`)

                let colorBlend =  this.$rsd.format.getColorBlend('#c70000', '#15c700', hpPercent)
                // console.log(colorBlend)

                return colorBlend + '8a'
            } else {
                return 'inverse--text'
            }
        }
    },
    methods: {
        openHealthDialog(member, index) {
            if (!!isGM || (!!this.localCharacter && !!this.localCharacter.id && this.localCharacter.id == member.id)) {
                if (!!member && (!!index || index == 0)) {
                    this.$rsd.dialog.open({name: 'combatantHealthDialog', attrs: [true, {...member.health, name: member.name, id: member.id, local: (!isGM && !this.isCombatOverview)}, {maxhp: member.health.maxhp}]})
                }
            }
        },
        openDamageDialog(event, member, index) {
            event.preventDefault()
            if (!!isGM || (!!this.localCharacter && !!this.localCharacter.id && this.localCharacter.id == member.id)) {
                if (!!member && (!!index || index == 0)) {
                    this.$rsd.dialog.open({name: 'damageDialog', attrs: [true, 
                        {value:1, affected: [this.member], dmg: 'untyped'}]
                    })
                }
            }
        }
    },
    props: {
        member: Object,
        index: Number,
        localCharacter: Object,
        initiative: Object,
    }
}
</script>
