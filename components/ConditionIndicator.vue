<template>
    <v-menu
        v-model="displayMenu"
        :close-on-content-click="false"
        :open-on-click="false"
        offset-x
        :nudge-left="250"
    >
        <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom :open-delay="500" >
                <template v-slot:activator="{ on: tooltip }">
                    <v-card-text 
                        class="py-1 px-1 d-flex align-center"
                        v-bind="attrs"
                        v-on="{...menu, ...tooltip}"
                        @contextmenu="showInfo"
                    >
                        <span 
                            class="primary gi-icon gi-icon-big" 
                            :style="getIconStyle()"
                        >
                        </span>
                        <span class="icon-offset icon-top-left circle" v-show="$rsd.conditions.isConditionReducing(condition)"><span class="gi-icon gi-icon-small black" :style="getDownStyle()"></span></span>
                        <span class="icon-offset icon-top-left circle" v-show="$rsd.conditions.isConditionLocked(condition)"><span class="gi-icon gi-icon-small black" :style="getLockStyle()"></span></span>
                        <span class="icon-offset icon-bottom-left circle" v-show="!!condition.duration"><span class="gi-icon gi-icon-small text-center black--text text-offset">{{condition.duration}}</span></span>
                        <span class="icon-offset icon-bottom-right circle" v-show="!!condition.value"><span class="gi-icon gi-icon-small text-center black--text text-offset">{{condition.value}}</span></span>
                    </v-card-text>
                </template>
                <span>{{$rsd.format.capitalize(getIconText())}}</span>
            </v-tooltip>
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
                } else {
                    let style = `
                    -webkit-mask: url("../icons/${this.condition.dmg.toLowerCase()}.svg") no-repeat center;
                    mask: url("../icons/${this.condition.dmg.toLowerCase()}.svg") no-repeat center;
                    `
                    return style
                }
            }
        },
        getIconText() {
            if (this.condition.type != "Persistent Damage") {
                return this.condition.type + ' ' + (this.condition.value || ' ')
            } else {
                return this.condition.dmg + ' ' + (this.condition.value || ' ')
            }
        },
        getLockStyle() {
            return `-webkit-mask: url('../gi-icons/padlock.svg') no-repeat center;
                    mask: url('../gi-icons/padlock.svg') no-repeat center;`
        },
        getDownStyle() {
            return `-webkit-mask: url('../gi-icons/plain-arrow.svg') no-repeat center;
                    mask: url('../gi-icons/plain-arrow.svg') no-repeat center;`
        },
    },
}
</script>

<style lang="less" scoped>
.icon-offset {
    position: absolute;
}
.icon-top-left {
    top: 0px;
    left: 0px
}
.icon-bottom-left {
    bottom: 0px;
    left: 0px
}
.icon-bottom-right {
    bottom: 0px;
    right: 0px
}
.text-offset {
    position: absolute;
    top: -2px;
    font-size: 12px;
}
.circle {
    background: white;
    border-color: black;
    border-style: solid;
    border-width: 1px;
    width: 18px;
    height: 18px;
    -moz-border-radius: 50px; 
    -webkit-border-radius: 50px; 
    border-radius: 50px;
}
</style>