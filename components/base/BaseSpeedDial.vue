<template>
    <v-speed-dial
        v-if="!!menu && !!menu.buttons"
        v-model="menuOpen"
        :top="!!menu.top ? true : false"
        :right="!!menu.right ? true : false"
        :bottom="!!menu.bottom ? true : false"
        :left="!!menu.left ? true : false"
        :direction="!!menu.direction ? menu.direction : 'bottom'"
        :transition="!!menu.transition ? menu.transition : 'slide-y-transition'"
    >
        <template v-slot:activator>
            <v-btn
                v-if="!!mobileView.sortMode"
                @click="confirmSort"
                @click.stop=""
                :color="!!menu.color ? menu.color : 'primary'"
                :dark="!!menu.light ? false : true"
                fab
            >
                <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
                v-else
                v-model="menuOpen"
                :color="!!menu.color ? menu.color : 'primary'"
                :dark="!!menu.light ? false : true"
                fab
            >
                <v-icon v-if="!!menuOpen" class="inverse--text">
                    {{ !!menu.closeIcon ? menu.closeIcon : 'mdi-close' }}
                </v-icon>
                <v-icon v-else class="inverse--text">
                    {{ !!menu.openIcon ? menu.openIcon : 'mdi-dots-vertical' }}
                </v-icon>
            </v-btn>
        </template>
        <v-btn
            v-for="(btn, index) in menu.buttons"
            :key="index"
            :color="!!btn.color ? btn.color : 'primary'"
            :dark="!!btn.light ? false : true"
            @click="!!btn.function ? btn.function($event) : null"
            v-show="!!btn.show ? btn.show() : true"
            fab
            small
        >
            <v-icon v-if="GameIcons.is.mdi(btn.icon)" class="inverse--text">{{btn.icon}}</v-icon>
            <span 
                v-else 
                class="gi-icon inverse--text"
                :style="GameIcons.get.icon(btn.icon)"  
            ></span>
        </v-btn>
    </v-speed-dial>
</template>

<script>
export default {
    data() {
        return {
            menuOpen: false,
        }
    },
    props: {
        menu: Object,
    },
    methods: {
        confirmSort() {
            this.$store.dispatch('rsd/setMobileView', {
                ...this.mobileView,
                sortMode: false
            })
        }
    }
}
</script>