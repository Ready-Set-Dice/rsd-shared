<template>
    <div class="text-center">
        <v-bottom-sheet
            v-model="displaySheet"
            content-class="no-shadow"
        >
            <v-sheet
                class="text-center px-5"
                outlined
                color="transparent"
                :height="calculateHeight"
            >
                <v-btn-toggle
                    class="flex-column rounded width-100"
                    v-if="menuItems.length > 1"
                >
                    <v-btn
                        v-for="(item, i) in menuItems"
                        v-if="i >= lowerbound && i < upperbound"
                        :key="'btn-'+i"
                        @click="click(item, i)"
                        :color="item.danger ? 'red--text' : 'info--text'"
                    >
                        {{ item.type }}
                    </v-btn>
                    <v-btn
                        v-if="menuItems.length > 5"
                        @click="nextpage()"
                    >
                        more
                    </v-btn>
                </v-btn-toggle>
                <v-btn
                    v-else
                    v-for="(item, i) in menuItems"
                    :key="'btn-'+i"
                    @click="click(item, i)"
                    class="width-100 mt-2 rounded"
                    min-height="50"
                    :color="item.danger ? 'red--text' : 'info--text'"
                >
                    {{ item.type }}
                </v-btn>

                <v-btn
                    class="width-100 mt-2 rounded"
                    @click="close()"
                    color="info--text"
                    min-height="50"
                >
                    Cancel
                </v-btn>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    data() {
        return {
            displaySheet: false,
            page: 0,
        }
    },
    props: {
        items: Array,
        callback: Function,
    },
    computed: {
        calculateHeight() {
            return (64 + (48*(Math.min(this.menuItems.length > 5 ? this.currentItems.length + 1 : this.currentItems.length, 6)))) + 'px'
        },
        lowerbound() {
            return 0+(5*this.page)
        },
        upperbound() {
            return 5+(5*this.page)
        },
        menuItems() {
            if (this.items && this.items.length > 0) {
                return this.items.filter(i => {
                    return !i.disabled || !i.disabled()
                })
            }
        },
        currentItems() {
            return this.menuItems.slice(this.lowerbound, this.upperbound)
        }
    },
    methods: {
        show() {
            this.displaySheet = true
        },

        close() {
            this.displaySheet = false
            this.page = 0
        },

        click(item, i) {
            this.callback(item, i)
            this.close()
        },

        nextpage() {
            if ((this.page+1) * 5 >= this.menuItems.length) {
                this.page = 0
            } else {
                this.page++
            }
        },
    }
}
</script>

<style scoped>
.no-shadow {
    box-shadow: none !important;
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