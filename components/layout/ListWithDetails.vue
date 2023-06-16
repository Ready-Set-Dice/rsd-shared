<template>
    <v-container class="no-overflow d-flex flex-column flex-nowrap px-0 pb-0" :class="!SMDown ? 'fill-height' : ''" fluid>
        <v-row v-if="!SMDown" class="col-12 pa-0 mx-0">
            <v-col
                class="list pa-0"
                :class="!!noDetails ? 'col-12 mb-10' : 'col-md-5 col-lg-4 col-xl-3 col-12'"
            >
                <div class="my-4 my-md-8">
                    <span class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5 ml-5">{{title}}</span>
                    <v-btn
                        v-if="!!addButtonHidden ? false : true"
                        icon
                        @click="addEvent"
                        class="float-right mr-4"
                        id="layout-list-add-button"
                        :small="MDDown"
                        :disabled="!!pageDisabled || !!addButtonDisabled ? true : false"
                    >
                        <v-icon>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                    <v-btn
                        v-if="!!filterIcon"
                        icon
                        @click="filterEvent"
                        class="float-right mr-1"
                        :small="MDDown"
                        :disabled="!!pageDisabled ? true : false"
                    >
                        <v-icon>{{filterIcon}}</v-icon>
                    </v-btn>
                </div>
                <v-divider>
                </v-divider>
                <v-list class="list py-0">
                    <v-list-item-group mandatory>
                        <slot name="list"></slot>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-divider
                v-if="!!noDetails ? false : true"
                vertical
                fill-height
            ></v-divider>
            <v-col cols=12 md=7 lg=8 xl=9 class="details py-0 px-7" v-if="!!noDetails ? false : true">
                <slot name="detailsHeader">
                    <div class="my-4 my-md-8" v-if="!!itemSelected">
                        <span 
                            class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5 title-overflow-fix" 
                            id="layout-details-title"
                        >{{detailsTitle}}</span>
                        <v-btn
                            outlined
                            class="float-right mt-1"
                            @click="manageEvent"
                            id="layout-details-manage-button"
                            :small="MDDown"
                        >
                            <span class="d-none d-sm-inline d-md-none d-lg-inline mr-2">Manage</span>
                            <v-icon>
                                mdi-dots-horizontal
                            </v-icon>
                        </v-btn>
                    </div>
                    <div class="my-4 my-md-8" v-else>
                        <span class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5">{{noSelectDetailsTitle}}</span>
                    </div>
                </slot>
                <slot name="details1"></slot>
                <slot name="details2"></slot>
            </v-col>
            <slot></slot>
        </v-row>
        <v-row v-if="!!SMDown" class="col-12 pa-0 mx-0">
            <v-tabs
                v-model="lwd_tab"
                background-color="list_drag"
                style="position: fixed; top: 57px; left: 0; width: 100%; z-index: 1;"
                grow
            >
                <template v-for="(item) in tabNames">
                    <v-tab :key="'lwd-key-'+item">{{item}}</v-tab>
                </template>
            </v-tabs>
            <v-tabs-items v-model="lwd_tab" class="col-12 pa-0 mx-0 mt-12">
                <v-tab-item class="mt-n4">
                    <v-col
                        class="list pa-0 pt-3"
                        :class="!!noDetails ? 'col-12 mb-10' : 'col-md-5 col-lg-4 col-xl-3 col-12'"
                    >
                        <div class="my-4 my-md-8">
                            <span class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5 ml-5">{{title}}</span>
                            <v-btn
                                v-if="!!addButtonHidden ? false : true"
                                icon
                                @click="addEvent"
                                class="float-right mr-4"
                                id="layout-list-add-button"
                                :small="MDDown"
                                :disabled="!!addButtonDisabled ? addButtonDisabled : false"
                            >
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                            <v-btn
                                v-if="!!filterIcon"
                                icon
                                @click="filterEvent"
                                class="float-right mr-1"
                                :small="MDDown"
                            >
                                <v-icon>{{filterIcon}}</v-icon>
                            </v-btn>
                        </div>
                        <v-divider>
                        </v-divider>
                        <v-list class="list py-0">
                            <v-list-item-group>
                                <slot name="list"></slot>
                            </v-list-item-group>
                        </v-list>
                    </v-col>
                </v-tab-item>
                <v-tab-item>
                    <v-col cols=12 md=7 lg=8 xl=9 class="details pt-0 px-7 mb-4" v-if="!!noDetails ? false : true">
                        <slot name="detailsHeader">
                            <div class="my-4 my-md-8" v-if="!!itemSelected">
                                <span 
                                    class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5 title-overflow-fix" 
                                    id="layout-details-title"
                                >{{detailsTitle}}</span>
                                <v-btn
                                    outlined
                                    class="float-right mt-1"
                                    @click="manageEvent"
                                    id="layout-details-manage-button"
                                    :small="MDDown"
                                >
                                    <span class="d-none d-sm-inline d-md-none d-lg-inline mr-2">Manage</span>
                                    <v-icon>
                                        mdi-dots-horizontal
                                    </v-icon>
                                </v-btn>
                            </div>
                            <div class="my-4 my-md-8" v-else>
                                <span class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5">{{noSelectDetailsTitle}}</span>
                            </div>
                        </slot>
                        <slot name="details1"></slot>
                    </v-col>
                </v-tab-item>
                <v-tab-item>
                    <v-col cols=12 md=7 lg=8 xl=9 class="details py-0 px-7" v-if="!!noDetails ? false : true">
                        <div class="my-4 my-md-8" v-if="!!itemSelected">
                            <span class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5 title-overflow-fix" v-text="detailsTitle"></span>
                            <v-btn
                                outlined
                                class="float-right mt-1"
                                @click="manageEvent"
                                :small="MDDown"
                            >
                                <span class="d-none d-sm-inline d-md-none d-lg-inline mr-2" v-text="'Manage'"></span>
                                <v-icon>
                                    mdi-dots-horizontal
                                </v-icon>
                            </v-btn>
                        </div>
                        <div class="my-10" v-else>
                            <span class="font-weight-bold text-h6 text-sm-h5 text-md-h6 text-lg-h5" v-text="noSelectDetailsTitle"></span>
                        </div>
                        <slot name="details2"></slot>
                    </v-col>
                </v-tab-item>
            </v-tabs-items>
            <slot></slot>
        </v-row>
    </v-container>
</template>

<script>

export default {
    data: () => ({
        lwd_tab: 0,
    }),
    props: {
        filterIcon: String,
        detailsTitle: String,
        noSelectDetailsTitle: String,
        itemSelected: Boolean,
        items: Array,
        title: String,
        pageDisabled: Boolean,
        addButtonHidden: Boolean,
        addButtonDisabled: Boolean,
        noDetails: Boolean,
        tabNames: Array,
    },
    computed: {
    },
    methods: {
        addEvent(event) {
            this.$emit('Add', event);
        },
        filterEvent(event) {
            this.$emit('Filter', event);
        },
        manageEvent(event) {
            this.$emit('Manage', event);
        },
        setTab(tab) {
            this.lwd_tab = tab
        },
    }
}
</script>

<style scoped>
.no-overflow {
    overflow-y: hidden;
}
</style>