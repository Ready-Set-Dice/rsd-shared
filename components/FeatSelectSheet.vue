<template>
    <div v-if="!!current && !!current.object && (current.object.type == 'feat' || current.object.type == 'heritage')">
        <div 
            v-if="current.object.description"
        >
            <div class="px-2">
                <div class="d-flex flex-row">
                    <span class="font-weight-bold text-body-1">{{current.object.name}}</span>
                    <span v-if="$rsd.format.hasActionNumber(current.object)" class="action">
                        {{$rsd.format.actionNumber(current.object)}}
                    </span>
                    <v-spacer></v-spacer>
                    <BaseTraitChip 
                        :border_less='true'
                        :trait="!!current.object.level ? current.object.level + '' : ''"
                        :icon="!!current.object.level ? '' : (current.object.type == 'heritage' ? 'family-tree' : '')"
                        :custom_class="$rsd.format.rarityColor(current.object.rarity)" 
                    />
                </div>
                <div>
                    <BaseTraitChip 
                        v-if="!!current.object.rarity && current.object.rarity != 'common'" 
                        :trait="current.object.rarity" 
                        :custom_class="$rsd.format.rarityColor(current.object.rarity)" 
                    />
                    <BaseTraitChip 
                        v-for="trait in current.object.traits" 
                        :key="'trait-'+trait" 
                        :trait="trait"
                        custom_class="common"
                    />
                </div>
                <span v-if="!!current.object.prerequisites && current.object.prerequisites.length > 0">
                    <span class="font-weight-bold">Prerequisites </span>
                    <span v-for="(item, index) in current.object.prerequisites" :key="'prereq-'+index">{{!!item.value ? item.value : item}}{{index != current.object.prerequisites.length -1 ? ', ' : ''}}</span>
                </span><br/>
            </div>
            <div 
                v-html="$sanitize(current.object.description)" 
                class="alt-scrollbar dialog-description pa-2">
            </div>
            <span class="pa-2 text-caption font-italic" :class="!!rsd.darkmode ? 'text--darken-2' : 'text--lighten-2'">{{!!current.object.source ? current.object.source : null}}</span>
        </div>
    </div>
</template>

<script>

import BaseTraitChip from '@/../../.shared/components/base/BaseTraitChip'

export default {
    components: {
        BaseTraitChip,
    },
    props: {
        current: Object,
    },
}
</script>