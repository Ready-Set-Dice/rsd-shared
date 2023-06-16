<template>
    <v-menu
        v-if="!!trait && !!traitDescription"
        :close-on-content-click="false"
        offset-x
        :nudge-left="250"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-chip
                v-on="on"
                v-bind="attrs"
                label
                color="white--text"
                :class="custom_class"
                class="px-1 text-uppercase roboto-condensed font-weight-medium tag"
                style="border-color: #f5daab !important;"
            >
                {{trait}}
            </v-chip>
        </template>
        <v-card
            elevation="5"
            width="500"
        >
            <v-card-title>{{capitalizedTrait}}</v-card-title>
            <v-card-text>{{traitDescription}}</v-card-text>
        </v-card>
    </v-menu>
    <v-chip
        v-else
        label
        color="white--text"
        :class="!!border_less ? `tag_small ${custom_class}` : `${custom_class}`"
        class="px-1 text-uppercase roboto-condensed font-weight-medium tag"
        :style="!!border_less ? '' : 'border-color: #f5daab !important;'"
    >
        <span 
            :class="!!icon ? 'gi-icon white' : ''"
            :style="!!icon ? GameIcons.get.style(icon) : ''"    
        >{{!!icon ? icon : trait}}</span>
    </v-chip>
</template>

<script>
export default {
    props: {
        trait: String,
        icon: String,
        custom_class: String,
        border_less: Boolean,
    },
    computed: {
        capitalizedTrait() {
            return this.$rsd.format.capitalize(this.trait.toLowerCase())
        },
        traitDescription() {
            return this.$rsd.static.getTraitDescription(this.capitalizedTrait)
        }
    }
}
</script>

<style lang="less" scoped>
.tag {
    border-radius: 0px !important;
    border-style: solid;
    border-width: 3px;
    height: 26px !important;;
}
.tag_small {
    height: 22px !important;;
}
</style>