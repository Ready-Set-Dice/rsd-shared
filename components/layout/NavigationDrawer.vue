<template>
    <v-navigation-drawer
        v-if="!SMDown"
        v-model="drawer"
        color="main lighten-1"
        :mini-variant="rsd.mininavbar"
        :width="225"
        app
    >
        <v-list
            nav
            dense
        >
            <v-list-item-group
                v-for="route in routes" 
                :key="route.path"
            >
                <v-list-item
                    link
                    :disabled="!!route.disabled"
                    v-show="showCheck(route)"
                    v-if="!route.type"
                    class="small-list"
                    :id="'route-'+route.path"
                    :to="!!route.disabled ? '' : route.path"
                    @click="checkClose(route.path)"
                >
                    <v-list-item-icon v-if="route.category !== 'head' && !!route.icon && !!rsd.mininavbar">
                        <v-icon color="accent">{{ route.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="accent--text" v-if="route.category === 'head'">
                            <h2>
                                <span v-if="rsd.mininavbar"><v-icon class="accent--text">{{ route.icon }}</v-icon></span>
                                <span v-else>{{ route.name }}</span>
                            </h2>
                        </v-list-item-title>
                        <v-list-item-title class="accent--text" v-else :class="!!rsd.mininavbar ? 'text-center' : ''">
                            <span :class="!!route.bold ? 'font-weight-black' : ''">{{ !!rsd.mininavbar && route.miniName ?  route.miniName : route.name }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider class="dark-divider" v-else-if="route.type == 'divider'" ></v-divider>
            </v-list-item-group>
            <v-list-item-group
                style="position: absolute; bottom: 0;"
            >
                <v-list-item 
                    link
                    @click="toggleMiniNavbar"
                >
                    <v-list-item-icon>
                        <v-icon color="accent" v-if="rsd.mininavbar">mdi-chevron-double-right</v-icon>
                        <v-icon color="accent" v-else>mdi-chevron-double-left</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="accent--text">
                            Collapse menu
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
        v-model="drawer"
        v-else
        color="main lighten-1"
        app
    >
        <v-list
            nav
            dense
        >
            <v-list-item-group
            v-for="route in routes" 
            :key="route.path"
            >
            <v-list-item
                link
                :disabled="!!route.disabled"
                v-show="showCheck(route)"
                v-if="!route.type"
                class="small-list"
                :id="'route-'+route.path"
                :to="!!route.disabled ? '' : route.path"
                @click="checkClose(route.path)"
            >
                <v-list-item-icon v-if="route.category !== 'head' && !!route.icon">
                    <v-icon color="accent">{{ route.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title class="accent--text" v-if="route.category === 'head'">
                        <h2 >{{ route.name }}</h2>
                    </v-list-item-title>
                    <v-list-item-title class="accent--text" v-else>
                        <span :class="!!route.bold ? 'font-weight-black' : ''">{{ route.name }}</span>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider v-else-if="route.type == 'divider'"></v-divider>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import auth from '@/../../shared/services/AuthService'

export default {
    props: {
        routes: Array,
    },
    data: () => ({
        drawer: false,
        developer : false,
    }),
    mounted () {
        this.drawer = false
        auth.profile().then(profile => {
            this.developer = profile.dev
        })
    },
    computed: {
        loggedIn () {
            return !!this.rsd && !!this.rsd.user
        },
    },
    methods: {
        divider(route) {
            return route.name && route.name.startsWith('divider')
        },
        isDev() {
            return process.env.NODE_ENV === "development" || !!this.developer
        },
        toggleMiniNavbar() {
            this.$store.dispatch('rsd/toggleMiniNavbar')
        },
        showCheck(route) {
            return (route.category !== 'hidden' && route.category !== 'dev') || 
            (
                !!route.meta && (
                    (route.meta.devOnly && this.isDev()) || 
                    (route.meta.showOnLogin && this.loggedIn) ||
                    (route.meta.showOnNotLogin && !this.loggedIn)
                )
            )
        },
        openDrawer() {
            this.drawer = true
        },
        closeDrawer() {
            this.drawer = false
        },
        toggleDrawer() {
            this.drawer = !this.drawer
        },
        checkClose(path) {
            if (!!path && path.includes('home')) {
                this.drawer = false
            }
        },
    }
}
</script>

<style scoped>
div >>> .small-list,
div >>> .small-list h2 {
    min-height: 20px;
}
div >>> .dark-divider {
    border-color: rgba(255, 255, 255, 0.12) !important;
}
</style>