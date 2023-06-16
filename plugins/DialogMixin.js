export default {
    data() {
        return {
            nullDialog: { show: () => { console.log("Error: Dialog does not exist")} }
        }
    },
    methods: {
        m_dialogExists(name) {
            return !!this.$refs && !!this.$refs[name];
        },
        m_dialogHasChild(name) {
            let dialogObject = this.$refs[name]
            return !!dialogObject && !!dialogObject[0]
        },
        getDialog(name) {
            return !!this.m_dialogExists(name) ? (!!this.m_dialogHasChild(name) ? this.$refs[name][0] : this.$refs[name]) : this.nullDialog;
        }
    }
}