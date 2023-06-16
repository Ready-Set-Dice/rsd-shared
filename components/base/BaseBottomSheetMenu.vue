<template>
    <v-bottom-sheet v-model="sheetOpen">
        <v-sheet
            class="text-center"
            height="450px"
        >
            <div class="d-flex flex-grow-1 justify-space-around mt-3">
                <v-btn
                    text
                    color="red"
                    @click="cancel()"
                >
                    Cancel
                </v-btn>
                <v-btn
                    text
                    color="green"
                    @click="confirm()"
                >
                    Confirm
                </v-btn>
            </div>
            <div class="d-flex flex-grow-1 pt-2 px-3">
                <v-select
                    v-model="sheetAction"
                    :items="items"
                    dense
                    outlined
                    return-object
                    hide-details
                    @change="changeAction"
                >
                    <template v-slot:selection="{ item }">
                        <v-icon v-if="GameIcons.is.mdi(item.icon)" class="mr-2">{{item.icon}}</v-icon>
                        <span 
                            v-else 
                            class="gi-icon icon_color mr-2"
                            :style="GameIcons.get.icon(item.icon)"  
                        ></span>
                        <span>{{ item.text }}</span>
                    </template>
                    <template v-slot:item="{ item }">
                        <v-icon v-if="GameIcons.is.mdi(item.icon)" class="mr-2">{{item.icon}}</v-icon>
                        <span 
                            v-else 
                            class="gi-icon icon_color mr-2"
                            :style="GameIcons.get.icon(item.icon)"  
                        ></span>
                        <span>{{ item.text }}</span>
                    </template>
                </v-select>
            </div>
            <div class="d-flex flex-grow-1 pt-3 px-3">
                <v-select
                    v-if="!!sheetAction && !!sheetAction.subitems"
                    v-model="sheetSubAction"
                    :items="sheetAction.subitems"
                    dense
                    outlined
                    return-object
                    hide-details
                >
                    <template v-slot:selection="{ item }">
                        <span
                            class="gi-icon icon_color mr-2"
                            :style="getIconStyle(item)"  
                        ></span>
                        <span>{{ item.text }}</span>
                    </template>
                    <template v-slot:item="{ item }">
                        <span
                            class="gi-icon icon_color mr-2"
                            :style="getIconStyle(item)"  
                        ></span>
                        <span>{{ item.text }}</span>
                    </template>
                </v-select>
            </div>
            <div class="d-flex flex-grow-1 pt-3" v-if="!!members && !!members.length > 0 ">
                <v-list
                    class="sheet-list"
                    dense
                >
                    <v-radio-group v-model="selectedMember" class="py-0 my-0">
                        <v-list-item
                            v-for="(member, index) in members" :key="'member-'+index"
                            v-show="!!sheetAction && ((!!sheetAction.type && sheetAction.type == member.type) || !sheetAction.type)"
                            class="text-left"
                            @click="selectMember(member)"
                            :style="'min-height: 40px; height: 40px;'"
                        >
                            <v-list-item-action>
                                <v-checkbox 
                                    v-if="!!sheetAction && !!sheetAction.multiple"
                                    v-model="selectedMembers"
                                    class="mt-n1"
                                    :value="member.id"
                                    @click="selectMember(member)"
                                    dense 
                                    hide-details 
                                ></v-checkbox>
                                <v-radio 
                                    v-if="!!sheetAction && !sheetAction.multiple"
                                    :value="member.id"
                                    @click="selectMember(member)"
                                    dense 
                                    hide-details
                                ></v-radio>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>{{ member.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ member.identifier }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-radio-group>
                </v-list>
            </div>
        </v-sheet>
    </v-bottom-sheet>
</template>

<script>
export default {
    data() {
        return {
            items: [],
            sheetOpen: false,
            sheetAction: null,
            sheetSubAction: null,
            selectedMembers: [],
            selectedMember: null,
        }
    },
    props: {
        members: Array,
    },
    methods: {
        open(items, defaultItem = null) {
            this.selectedMembers = []
            this.selectedMember = null
            if (!!items && items.length > 0) {
                this.items = items
                this.sheetAction = items[0]
                this.sheetOpen = true
                if (!!this.sheetAction.subitems && this.sheetAction.subitems.length > 0) {
                    this.sheetSubAction = this.sheetAction.subitems[0]
                } else {
                    this.sheetSubAction = null
                }
            }

            if (!!defaultItem) {
                this.selectedMember = defaultItem
            }
        },
        cancel() {
            this.sheetOpen = false
        },
        confirm() {
            this.sheetOpen = false

            if (!!this.sheetAction && !!this.sheetAction.function) {
                const value = !!this.sheetSubAction && !!this.sheetSubAction.value ? this.sheetSubAction.value : null
                
                if (!!this.members && this.members.length > 0) {
                    if (!!this.sheetAction.multiple) {
                        const newSelected = this.members.filter(m => {
                            const index = this.selectedMembers.findIndex(s => s == m.id)
                            return index != -1
                        })
                        
                        this.sheetAction.function(newSelected, value)
                    } else {
                        const index = this.members.findIndex(m => m.id == this.selectedMember)

                        if (index != -1) {
                            this.sheetAction.function(this.members[index], value)
                        }
                    }
                } else if (!!this.selectedMember) {
                    if (!!this.sheetAction.multiple) {
                        this.sheetAction.function([this.selectedMember], value)
                    } else {
                        this.sheetAction.function(this.selectedMember, value)
                    }
                }
            }
        },

        selectMember(member) {
            if (!!this.sheetAction && !!this.sheetAction.multiple) {
                if (!!this.selectedMembers && this.selectedMembers.length > 0) {
                    const index = this.selectedMembers.findIndex(s => s == member.id)
                    if (index != -1) {
                        this.selectedMembers.splice(index, 1)
                    } else {
                        this.selectedMembers.push(member.id)
                    }
                } else {
                    this.selectedMembers = [member.id]
                }

                this.selectedMember = this.selectedMembers[0]
            } else {
                this.selectedMember = member.id
                this.selectedMembers = [member.id]
            }
        },

        changeAction(action) {
            if (!!action.subitems && action.subitems.length > 0) {
                this.sheetSubAction = action.subitems[0]
            } else {
                this.sheetSubAction = null
            }

            // Check that the selected members are still valid if the action has a type
            if (!!action.type) {
                if (!!action.multiple) {
                    if (!!this.selectedMembers && this.selectedMembers.length > 0) {
                        let newSelected = []
                        this.members.forEach(s => {
                            if (!!s && s.type == action.type) {
                                newSelected.push(s.id)
                            }
                        })

                        this.selectedMembers = newSelected
                        if (newSelected.length > 0) {
                            this.selectedMember = newSelected[0]
                        }
                    }
                } else {
                    if (!!this.selectedMember) {
                        const index = this.members.findIndex(s => s.id == this.selectedMember)

                        if (index != -1 && !!this.members[index] && !!this.members[index].type && this.members[index].type != action.type) {
                            this.selectedMember = null
                            this.selectedMembers = []
                        }
                    }
                }
            } else if (!action.multiple) {
                if (!!this.selectedMembers && this.selectedMembers.length > 0) {
                    this.selectedMember = this.selectedMembers[0]
                }
            }
        },

        getIconStyle(condition) {
            if (!!condition) {
                let name = !!condition.icon ? condition.icon.toLowerCase() : condition.value.toLowerCase()
                if (name == 'temporary hp') { name = 'temporary' }
                if (name == 'regular') { name = 'heal' }
                let style = `
                -webkit-mask: url("../icons/${name}.svg") no-repeat center;
                mask: url("../icons/${name}.svg") no-repeat center;
                `
                
                return style
            }
        },
    }
}
</script>

<style lang="less" scoped>
.sheet-list {
    border-style: solid;
    border-color: #444;
    border-width: 1px;
    overflow-y: scroll;
    height: 250px;
    width: 100%;
}
</style>