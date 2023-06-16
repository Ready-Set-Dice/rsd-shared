<template>
    <span v-show="!!header && (!!text || (!!number || number == 0) || (!!array && array.length > 0))">
        <span class="font-weight-bold mr-1">{{header}}</span>
        <span v-show="!!text">{{text}}</span>
        <span v-show="!!number || number == 0">{{number}}</span>
        <span v-show="!!array && array.length > 0">
            <span 
                v-for="(item,index) in array"
                :key="'trait-'+item+'-'+index"
            >{{ item }}{{ index < array.length - 1 ? ', ' : '' }}</span>
        </span>
        <span v-show="!!append">{{ append }}</span>
    </span>
</template>

<script>
export default {
    props: {
        header: String,
        text: String,
        number: Number,
        array: Array,
        append: String,
    }
}
</script>