<template>
    <v-menu
        v-model="displayMenu"
        :close-on-content-click="false"
        :open-on-click="false"
        offset-x
        :nudge-left="250"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-card-text 
                class="py-1 px-1 d-flex align-center justify-space-between"
                v-bind="attrs"
                v-on="on"
                @contextmenu="showInfo"
            >
                <span 
                    class="primary gi-icon mr-1" 
                    :style="getIconStyle()"
                >
                </span>
                <span v-if="!!label" class="font-weight-medium mr-2">{{$rsd.format.capitalize(getIconText())}}</span>
                <v-icon v-if="$rsd.conditions.isConditionReducing(condition)">mdi-arrow-down-bold</v-icon>
                <v-icon v-if="$rsd.conditions.isConditionLocked(condition)">mdi-lock</v-icon>
                <v-chip 
                    label
                    small
                    :class="!!condition.duration && condition.duration !== 0 ? 'px-2' : 'px-1'"
                >
                    <span v-text="!!condition.duration && condition.duration > 0 ? condition.duration : ''"></span>
                    <v-icon v-if="!condition.duration || condition.duration === 0" small>mdi-infinity</v-icon>
                </v-chip>
            </v-card-text>
        </template>
        <v-card
            elevation="5"
            width="500"
        >
            <v-card-title>{{$rsd.format.capitalize(condition.type)}}</v-card-title>
            <v-card-text v-html="$sanitize($rsd.conditions.getConditionDescription(condition.type))"></v-card-text>
        </v-card>
    </v-menu>
</template>

<script>
export default {
    data() {
        return {
            displayMenu: false,
        }
    },
    props: {
        condition: Object,
        label: Boolean,
    },
    methods: {
        showInfo(event) {
            event.preventDefault()
            this.displayMenu = true
        },
        getIconStyle() {
            if (!!this.condition) {
                if (this.condition.type.toLowerCase() != "persistent damage") {
                    let name = !!this.condition.icon ? this.condition.icon.toLowerCase() : this.condition.type.toLowerCase()
                    if (name == 'temporary hp') { name = 'temporary' }
                    let style = `
                    -webkit-mask: url("../icons/${name}.svg") no-repeat center;
                    mask: url("../icons/${name}.svg") no-repeat center;
                    `
                    
                    return style
                } else if (!!this.condition.dmg) {
                    let style = `
                    -webkit-mask: url("../icons/${this.condition.dmg.toLowerCase()}.svg") no-repeat center;
                    mask: url("../icons/${this.condition.dmg.toLowerCase()}.svg") no-repeat center;
                    `
                    return style
                }
            }
        },
        getIconText() {
            if (!!this.condition) {
                if (this.condition.type.toLowerCase() != "persistent damage") {
                    return this.condition.type + ' ' + (this.condition.value || ' ')
                } else if (!!this.condition.dmg) {
                    return this.condition.dmg + ' ' + (this.condition.value || ' ')
                }
            }
        },
    },
}
</script>