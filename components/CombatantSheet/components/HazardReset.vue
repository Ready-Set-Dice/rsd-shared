<template>
    <span v-if="!!detail" style="overflow-wrap: anywhere;">
        <span class="font-weight-bold mr-1">Reset</span>
        <span
            v-for="(item, index) in detail"
            :key="'node-'+index"
        >
            <BaseItemNode :item="item" />
        </span>
    </span>
</template>

<script>
import BaseItemNode from '@root/.shared/components/base/BaseItemNode'

export default {
    components: {
        BaseItemNode,
    },
    props: {
        detail: Array,
    },
}
</script>