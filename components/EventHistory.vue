<template>
    <v-menu 
        content-class="alt-sceventbar"
        transition="scevent-y-transition"
        :offset-y="true"
    >
        <template v-slot:activator="{ on, attrs }">
            <span
                v-on="on"
                v-bind="attrs"
                class="justify-space-between event-history px-2 ml-14"
                :class="!hidden ? (!!rsd.darkmode ? 'd-flex theme--dark' : 'd-flex') : 'd-none'"
            >
                <span v-if="!!eventHistory && !!eventHistory.length > 0">
                {{eventHistory[0].identifier}} -
                    <span :class="!!firstEventHistory && !!firstEventHistory.critfail ? 'red--text' : (!!firstEventHistory && !!firstEventHistory.critsuccess ? 'green--text' : '')">
                        {{!!firstEventHistory ? firstEventHistory.short : ''}}
                    </span>
                </span>
                <span v-else>No event history</span>
            </span>
        </template>
        <v-list class="event-history-list" >
            <v-list-item
                v-for="(item, index) in eventHistory"
                :key="index"
                dense
                tile
                class="inverse"
            >
                <v-list-item-content :style="'max-width: 370px'" class="pa-0 mb-3">
                    <span class="text-subtitle-2">{{item.identifier}}</span>
                    <v-list-item
                        v-for="(event, rindex) in item.events"
                        :key="index+'-'+rindex"
                        dense
                        class="list_even"
                        :style="'min-height: 32px; width: 100%;'"
                    >
                        <v-list-item-title
                        class="py-1"
                        :style="'white-space: pre-wrap'"
                        :class="!!event.critfail ? 'red--text' : (!!event.critsuccess ? 'green--text' : '')"
                        >{{!!event.full ? event.full : event.short}}</v-list-item-title>
                    </v-list-item>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    data() {
        return {
            eventHistory: [],
        }
    },
    props: {
        hidden: Boolean,
    },
    computed: {
        firstEventHistory() {
            return this.eventHistory[0].events[0]
        },
        lastEventHistory() {
            return this.eventHistory[this.eventHistory.length - 1].events[this.eventHistory[this.eventHistory.length - 1].events.length - 1]
        },
        show () {
            console.log('show', this.hidden)
            return !this.hidden
        },
    },
    methods: {
        handleEventHistoryUpdate() {
            this.eventHistory = this.$rsd.eventhistory.get()
        },
    },
    created() {
        this.$rsd.eventhistory.on('Update',  this.handleEventHistoryUpdate)
    },
    destroyed() {
        this.$rsd.eventhistory.removeListener('Update',  this.handleEventHistoryUpdate)
    },
    mounted() {
        this.handleEventHistoryUpdate()
    },
}
</script>

<style>
.event-history {
    border-color: gray;
    border-width: 0.1px;
    border-style: solid;
    width: 400px;
    background: rgba(255,255,255,0.6);
}
.event-history.theme--dark {
    background: rgba(0,0,0,0.3);
}

.event-history-list {
    max-height: 70vh;
}
.event-history-list .v-list-item{
    padding-right: 0;
}
</style>