<template>
    <hr v-if="!!item && !!item.type && item.type == 'HR'" />
    <span
        v-else-if="!!item && !!item.type && item.type == 'TEXT'"
    >{{item.data}}</span>
    <span
        v-else-if="!!item && !!item.type && item.type == 'EM'"
        :class="itemType"
        class="font-italic mb-1"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </span>
    <p
        v-else-if="!!item && !!item.type && item.type == 'P'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </p>
    <p
        v-else-if="!!item && !!item.type && item.type == 'P-MB-1'"
        :class="itemType"
        class="mb-1"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </p>
    <p
        v-else-if="!!item && !!item.type && item.type == 'P-MB-0'"
        :class="itemType"
        class="mb-0"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </p>
    <p
        v-else-if="!!item && !!item.type && item.type == 'H1'"
        :class="itemType"
        class="text-h6 font-weight-bold mb-0 mt-1"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </p>
    <p
        v-else-if="!!item && !!item.type && item.type == 'H2'"
        :class="itemType"
        class="text-subtitle-1 font-weight-bold mb-0 mt-1"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </p>
    <ul
        v-else-if="!!item && !!item.type && item.type == 'UL'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </ul>
    <li
        v-else-if="!!item && !!item.type && item.type == 'LI'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </li>
    <td
        v-else-if="!!item && !!item.type && item.type == 'TD'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </td>
    <th
        v-else-if="!!item && !!item.type && item.type == 'TH'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </th>
    <tr
        v-else-if="!!item && !!item.type && item.type == 'TR'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </tr>
    <tbody
        v-else-if="!!item && !!item.type && item.type == 'TBODY'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :class="index % 2 == 0 ? 'list_even' : 'list_odd'" :modifier="modifier"/>
        </template>
    </tbody>
    <thead
        v-else-if="!!item && !!item.type && item.type == 'THEAD'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </thead>
    <table
        v-else-if="!!item && !!item.type && item.type == 'TABLE'"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children" >
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </table>
    <!-- TODO: add effects from condtions to skills -->
    <span
        v-else-if="!!item && !!item.type && item.type == 'SKILL'"
        class="font-weight-medium"
        :class="!!modifier ? 'red--text font-weight-medium' : ''"
    >
        DC {{!!modifier ? getModifiedDC(item.dc) : item.dc}} {{!!item.basic ? 'basic ' : ''}}{{!!item.save ? item.save : ''}}
    </span>
    <span
        v-else-if="!!item && !!item.type && item.type == 'DAMAGE'"
    >
        <span
            v-if="!!item.value"
            class="font-weight-medium"
            :class="!!modifier ? 'red--text font-weight-medium' : ''"
        >{{ item.value }}{{ !!modifier ? '+'+modifier : '' }}</span>
        <span v-if="!!item.attributes">&nbsp;{{ item.attributes.toString() }}</span>
    </span>
    <span
        v-else-if="!!item"
        :class="itemType"
    >
        <template v-for="(node, index) in item.children">
            <BaseItemNode :item="node" :key="'child-'+index" :modifier="modifier" />
        </template>
    </span>
</template>

<script>
export default {
    props: {
        item: Object,
        modifier: Number,
    },
    components: {
        BaseItemNode: () => import('./BaseItemNode.vue')
    },
    computed: {
        itemType() {
            if (!!this.item) {
                if (!!this.item.type) {
                    if (this.item.type == 'STRONG' || this.item.type == 'B') {
                        return 'font-weight-bold'
                    } else if (this.item.type == 'I') {
                        return 'font-italic'
                    } else if (this.item.type == 'THEAD') {
                        return 'main white--text'
                    } else if (this.item.type == 'TH' || this.item.type == 'TD') {
                        return 'text-left px-2'
                    } else if (this.item.type == 'TABLE') {
                        return 'ma-4'
                    }
                }
            }
            return ''
        }
    },
    methods: {
        getModifiedDC(dc) {
            const modified = Number(dc) + Number(this.modifier)
            return modified
        }
    }
}
</script>

<style scoped>
span >>> span.actions-description p {
    margin-bottom: 0 !important;
}
</style>