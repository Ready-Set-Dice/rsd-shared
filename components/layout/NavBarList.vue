<template>
    <NoMobileTransition>
        <v-sheet
            v-show="!!show"
            class="v-fake-drawer"
            :style="'height: 100%; top: 0px; transform: translateX(0%);' + (!!list.style ? list.style : '')"
            :class="(!!list.class ? list.class : '') + (!!mini ? ' mini' : '')"
        >
            <div class="v-navigation-drawer__content">
                <v-list class="d-flex flex-column" height="100%" v-if="!!list && !!list.items">
                    <v-list-item class="no-flex header" v-if="!!list.header && !!list.header.title">
                        <v-list-item-icon class="mr-5" v-if="!!list.header.icon">
                            <v-icon large class="mt-n1 mb-n2" >{{list.header.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                <span>{{list.header.title}}</span>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action class="mr-n2" v-if="!!list.header.option">
                            <v-btn icon @click="list.header.optionclick()">
                                <v-icon>{{list.header.option()}}</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                    <v-hover v-slot="{ hover }">
                        <div v-show="!!list.firstitem && !!list.firstitem.title">
                            <v-list-item
                                v-if="!!list.firstitem && !!list.firstitem.title"
                                @click="list.firstitem.click($event)"
                                class="no-flex"
                            >
                                <v-list-item-avatar
                                    class="ml-n2"
                                    tile
                                >
                                    <v-btn 
                                        icon
                                        tile 
                                        class="white--text"
                                        :class="!!list.firstitem.active() ? 'primary' : 'grey'"
                                        elevation="5"
                                    ><v-icon>{{list.firstitem.icon}}</v-icon></v-btn>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{list.firstitem.title}}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-icon v-show="!!list.firstitem.active() && !hover">mdi-chevron-right</v-icon>
                                    <v-icon 
                                        v-show="!!hover"
                                        @click="list.firstitem.action($event)"
                                        @click.stop=""
                                        @mousedown.stop=""
                                        @touchstart.stop=""
                                        class="my-1"
                                    >mdi-dots-vertical</v-icon>
                                </v-list-item-action>
                            </v-list-item>
                        </div>
                    </v-hover>
                    <div :class="c_navlistClasses()">
                        <template
                            v-for="(item, id) in list.items.get()" 
                        >
                            <v-hover v-slot="{ hover }" :key="'list-item-'+id">
                                <v-list-item class="no-flex" @click="list.items.click($event, item, id)">
                                    <v-list-item-avatar
                                        class="ml-n2"
                                        :tile="!!list.items.avatar"
                                    >
                                        <v-chip
                                            v-if="!!list.items.avatar"
                                            label
                                            class="px-2 mr-2 justify-center"
                                            style="width:32px;"
                                            @click="list.items.avatarclick($event, item, id)"
                                            @click.stop=""
                                            @mousedown.stop=""
                                            @touchstart.stop=""
                                        >
                                            {{list.items.avatar(item, id)}}
                                        </v-chip>
                                        <v-btn
                                            v-else
                                            icon 
                                            class="white--text"
                                            :class="!!list.items.active(item, id) ? (!!item.color ? '' : 'primary') : 'grey'"
                                            :style="!!item.color ? `background-color: rgba(${item.color.r},${item.color.g},${item.color.b},${item.color.a});` : ''"
                                            elevation="5"
                                        >
                                            <span 
                                                v-if="!!item.icon && !!list.items.gicon" 
                                                class="gi-icon white"
                                                :style="list.items.gicon(item, id)"    
                                            ></span>
                                            <v-icon v-else-if="!!list.items.icon">{{list.items.icon(item, id)}}</v-icon>
                                        </v-btn>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title v-if="!!list.items.title(item, id)">{{list.items.title(item, id)}}</v-list-item-title>
                                        <v-list-item-subtitle v-if="!!list.items.subtitle(item, id)">{{list.items.subtitle(item, id)}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action class="d-flex flex-row align-center">
                                        <v-icon v-show="!!list.items.active(item, id) && !hover">{{!!list.items.activeicon ? list.items.activeicon(item, id) : 'mdi-chevron-right'}}</v-icon>
                                        <v-icon
                                            v-if="!!list.items.action"
                                            v-show="!!hover"
                                            @click="list.items.action($event, item, id)"
                                            @click.stop=""
                                            @mousedown.stop=""
                                            @touchstart.stop=""
                                            class="my-1"
                                        >mdi-dots-vertical</v-icon>
                                        <v-icon
                                            v-if="!!list.items.edit"
                                            v-show="!!hover"
                                            @click="list.items.edit($event, item, id)"
                                            @click.stop=""
                                            @mousedown.stop=""
                                            @touchstart.stop=""
                                            class="mr-1"
                                        >mdi-pencil</v-icon>
                                        <v-icon
                                            v-if="!!list.items.remove"
                                            v-show="!!hover"
                                            @click="list.items.remove($event, item, id)"
                                            @click.stop=""
                                            @mousedown.stop=""
                                            @touchstart.stop=""
                                            class="ml-1 red--text"
                                        >mdi-trash-can</v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-hover>
                            <v-divider 
                                class="ml-7 mr-10"
                                :key="'party-item-divider-'+id"
                                :class="!!list.items.active(item, id) ? '' : 'white'"
                            ></v-divider>
                            <slot name="after-item" :item="item" :id="id"></slot>
                        </template>
                        <v-list-item 
                            class="no-flex"
                            @click="list.additem.click()"
                            v-if="!!list.additem && !!list.additem.title"
                        >
                            <v-list-item-avatar
                                class="ml-n2"
                            >
                                <v-btn
                                    icon 
                                    class="white--text grey lighten-2"
                                    elevation="5"
                                >
                                    <v-icon>{{list.additem.icon}}</v-icon>
                                </v-btn>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="grey--text lighten-2">
                                    <span>{{list.additem.title}}</span>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                            v-if="!!list.altitem && !!list.altitem.title" 
                            @click="list.altitem.click()"
                            class="primary inverse--text mt-auto no-flex"
                            v-show="!mini"
                        >
                            <v-list-item-content>
                                <v-list-item-title class="d-flex align-center justify-space-between">
                                    <span class="text-decoration-underline">{{list.altitem.title}}</span>
                                    <v-icon class="inverse--text">{{list.altitem.icon}}</v-icon>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item 
                            v-if="!!list.altitem && !!list.altitem.title" 
                            @click="list.altitem.click()"
                            class="primary inverse--text mt-auto no-flex"
                            v-show="!!mini"
                            :ripple="false"
                        >
                            <v-list-item-icon>
                                <v-icon class="inverse--text">{{list.altitem.icon}}</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </div>
                </v-list>
                <slot></slot>
            </div>
            <div class="v-navigation-drawer__border"></div>
        </v-sheet>
    </NoMobileTransition>
</template>

<script>
import NoMobileTransition from '@/../../.shared/components/layout/NoMobileTransition'

export default {
    components: {
        NoMobileTransition,
    },
    props: {
        show: Boolean,
        mini: Boolean,
        list: Object,
    },
    methods: {
        c_navlistClasses() {
            let classes = 'navbar-list';

            if (!!this.mini) {
                classes += ' navbar-list-mini '
            }
            
            return !!this.list.special ? classes + 'navbar-list-special' : classes
        }
    }
}
</script>

<style lang="less" scoped>
.pretty-expand-div span {
    align-self: center;
    font-size: 1rem;
    flex: 1 1 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.v-list-item {
    min-height: 62px;
    flex: 0;
}

.v-fake-drawer {
    display: flex;
    flex-direction: column;
    left: 0;
    overflow: hidden;
    pointer-events: auto;
}

.navbar-list {
    display: flex;
    flex-direction: column;
    height: calc(~"100vh - 140px");
    overflow-y: auto; 
    overflow-x: hidden;
}
.navbar-list-special {
    height: calc(~"100vh - 204px") !important;
}

.navbar-list-mini {
    overflow-y: hidden; 
}

.v-list-item {
    padding: 0 14px;
}

.v-list-item.header {
    padding-left: 8px;
}

.theme--light.v-fake-drawer {
    background-color: rgba(0, 0, 0, 0.12);
}
.theme--dark.v-navigation-drawer {
    background-color: rgba(255, 255, 255, 0.12);
}
</style>