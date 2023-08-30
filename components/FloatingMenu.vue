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
            <v-list :width="!!width && width != -1 ? width : ''" dense class="py-0">
                <v-expand-transition>
                    <div
                        v-if="expand"
                    >
                        <template v-for="(item, i) in menuItems">
                            <v-list-item
                                :key="'item-'+i"
                                v-if="!item.type"
                                v-show="!item.hidden || !!item.hidden()"
                                class="v-list-item--extra-dense"
                                @click="item.func"
                                @click.right="preventDefault($event)"
                            >
                                <v-list-item-icon v-if="item.icon" class="mr-3 my-1">
                                    <v-icon v-if="checkMDIIcon(item.icon)">{{item.icon}}</v-icon>
                                    <span 
                                        v-else 
                                        class="gi-icon icon_color"
                                        :style="GameIcons.get.icon(item.icon)"  
                                    ></span>
                                </v-list-item-icon>
                                <v-list-item-title >{{ item.title }}</v-list-item-title>
                            </v-list-item>
                            <v-divider :key="'divider-'+i" v-if="item.type == 'divider'"></v-divider>
                        </template>
                    </div>
                </v-expand-transition>
            </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>
import GameIcons from '@root/.shared/plugins/IconMixin'

export default {
    mixins: [
        GameIcons
    ],
    data() {
        return {
            displayMenu: false,
            expand: false,
            hidden: false,
            xpos: 50,
            ypos: 50,
            items: [],
            width: -1,
        }
    },
    computed: {
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

            this.hidden = true
            this.displayMenu = false
            this.expand = false
            setTimeout(() => {
                this.delayedShow()
            }, 10)
        },

        close() {
            this.hidden = true
            this.displayMenu = false
            this.expand = false
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

        checkMDIIcon(icon) {
            return icon.includes('mdi-')
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

.v-list-item--extra-dense {
    min-height: 30px;
}
</style>