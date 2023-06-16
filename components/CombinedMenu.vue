<template>
    <div>
        <div style="display:none">
            <v-menu
                v-model="displayMenu"
                :position-x="xpos"
                :position-y="ypos"
                :content-class="hidden ? 'hidden' : ''"
                bottom
                transition="none"
            >
            <v-list :width="!!width && width != -1 ? width : ''">
                <v-expand-transition>
                    <div
                        v-if="expand"
                    >
                        <v-list-item
                            v-for="(item, i) in menuItems"
                            :key="i"
                            @click="item.func"
                            @click.right="preventDefault($event)"
                        >
                            <v-list-item-icon v-if="item.icon"><v-icon>{{item.icon}}</v-icon></v-list-item-icon>
                            <v-list-item-title >{{ item.title }}</v-list-item-title>
                        </v-list-item>
                    </div>
                </v-expand-transition>
            </v-list>
            </v-menu>
        </div>
        <div class="text-center">
            <v-bottom-sheet
                v-model="displaySheet"
                content-class="no-shadow"
            >
                <v-sheet
                    class="text-center"
                    outlined
                    color="transparent"
                    :height="calculateHeight"
                >
                    <v-btn-toggle
                        class="flex-column rounded full-width"
                        v-if="menuItems.length > 1"
                    >
                        <v-btn
                            v-for="(item, i) in menuItems"
                            :key="'btn-'+i"
                            @click="mobileClick(item.func)"
                            :color="item.danger ? 'red--text' : 'info--text'"
                        >
                            {{ item.title }}
                        </v-btn>
                    </v-btn-toggle>
                    <v-btn
                        v-else
                        v-for="(item, i) in menuItems"
                        :key="'btn-'+i"
                        @click="mobileClick(item.func)"
                        class="full-width mt-2 rounded"
                        min-height="50"
                        :color="item.danger ? 'red--text' : 'info--text'"
                    >
                        {{ item.title }}
                    </v-btn>

                    <v-btn
                        class="full-width mt-2 rounded"
                        @click="displaySheet = false"
                        color="info--text"
                        min-height="50"
                    >
                        Cancel
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            displayMenu: false,
            displaySheet: false,
            expand: false,
            hidden: false,
            xpos: 50,
            ypos: 50,
            items: [],
            width: -1,
        }
    },
    computed: {
        isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        },
        calculateHeight() {
            return (130 + (50*(this.menu.items.length - 1))) + 'px'
        },
        menuItems() {
            if (this.items && this.items.length > 0) {
                return this.items.filter(i => {
                    return !i.disabled || !i.disabled()
                })
            } else {
                return this.menu.items.filter(i => {
                    return !i.disabled || !i.disabled()
                })
            }
        }
    },
    props: {
        menu: Object,
    },
    watch: {
        displayMenu: {
            handler: function (newVal, oldVal) {
                if (!!oldVal && !newVal) {
                    this.$emit('Close')
                }
            }
        }
    },
    methods: {
        show(xpos, ypos, attrs = {}) {
            this.xpos = xpos;
            this.ypos = ypos;

            if (!!attrs.items && attrs.items.length > 0) {
                this.items = attrs.items
            } else {
                this.items = []
            }

            if (!!attrs.width) {
                this.width = attrs.width
            }

            if (this.isTouchDevice) {
                this.displaySheet = true
            } else {
                this.hidden = true
                this.displayMenu = false
                this.expand = false
                setTimeout(() => {
                    this.delayedShow()
                }, 10)
            }
        },

        close() {
            this.hidden = true
            this.displayMenu = false
            this.expand = false
        },

        mobileClick(func) {
            this.displaySheet = false;
            func();
        },

        delayedShow() {
            this.hidden = false
            this.displayMenu = true

            setTimeout(() => {
                this.expand = true
            }, 200)
        },

        preventDefault(event) {
            event.preventDefault();
        },
    }
}
</script>

<style scoped>
.no-shadow {
    box-shadow: none !important;
}
.full-width {
    width: 95%;
}
.v-btn-toggle.flex-column.rounded {
    border-top-right-radius: 12px !important;
    border-top-left-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
}
.v-btn-toggle.flex-column.rounded .v-btn:first-child {
    border-top-right-radius: 12px !important;
    border-top-left-radius: 12px !important;
    border-bottom-right-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}
.v-btn-toggle.flex-column.rounded .v-btn:last-child {
    border-top-right-radius: 0px !important;
    border-top-left-radius: 0px !important;
    border-bottom-right-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
}
.v-btn-toggle.flex-column.rounded .v-btn {
    border-radius: 0px;
}
.v-btn.rounded, button.v-btn.rounded {
    border-top-right-radius: 12px !important;
    border-top-left-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
}
</style>