<template>
    <v-container>
        <v-snackbar
            v-for="(s,i) in snackbars"
            :key="i"
            v-model="s.shown"
            :style="{'margin-bottom':calcMargin(s.uid)}"
            timeout="6000"
        >
        <span class="font-weight-medium d-block mb-2" v-text="s.title"></span>
        <pre class="d-block" v-text="s.text" style="line-height:0.75;"></pre>
            <template v-slot:action="{ attrs }">
                <v-btn
                color="blue darken-1"
                text
                v-bind="attrs"
                @click="close(s.uid)"
                >
                Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

export default {
    data() {
        return {
            snackbars: []
        }
    },
    props: {
    },
    methods: {
        close(uid) {
            const index = this.snackbars.findIndex(e => e.uid == uid)
            if (index != -1) {
                this.snackbars[index].shown = false
                this.snackbars.splice(index,1)
            }
        },
        show(newData) {
            let newSnackbar = {
                uid: uuidv4(),
                text: newData.text,
                title: newData.title,
                shown: false,
            }

            this.snackbars.push(newSnackbar)
            const newIndex = this.snackbars.length-1

            this.snackbars[newIndex].shown = true

            setTimeout(() => {
                this.close(newSnackbar.uid)
            }, 5500)
        },
        calcMargin(uid) {
            const index = this.snackbars.findIndex(e => e.uid == uid)
            // let count = (this.snackbars[index].text.match(/\n/g) || []).length
            let totalOffset = 0
            let count = 0
            for (var i=0; i<=index; i+=1) {
                if (i != 0) {
                    count = (this.snackbars[i-1].text.match(/\n/g) || []).length
                    if (this.snackbars[i-1].title)
                        count += 1
                }
                totalOffset += 60 + (count*15)
            }
            return (totalOffset) + 'px'
        },

    }
}
</script>