export default {
    computed: {
        XSOnly() {
            return !!this.$vuetify.breakpoint.xsOnly;
        },
        SMOnly() {
            return !!this.$vuetify.breakpoint.smOnly;
        },
        MDOnly() {
            return !!this.$vuetify.breakpoint.mdOnly;
        },
        LGOnly() {
            return !!this.$vuetify.breakpoint.lgOnly;
        },
        XLOnly() {
            return !!this.$vuetify.breakpoint.xlOnly;
        },

        SMDown() {
            return !!this.$vuetify.breakpoint.smAndDown;
        },
        SMUp() {
            return !!this.$vuetify.breakpoint.smAndUp;
        },
        MDDown() {
            return !!this.$vuetify.breakpoint.mdAndDown;
        },
        MDUp() {
            return !!this.$vuetify.breakpoint.mdAndUp;
        },
        LGDown() {
            return !!this.$vuetify.breakpoint.lgAndDown;
        },
        LGUp() {
            return !!this.$vuetify.breakpoint.lgAndUp;
        },
        XLDown() {
            return !!this.$vuetify.breakpoint.xlAndDown;
        },
        XLUp() {
            return !!this.$vuetify.breakpoint.xlAndUp;
        },
    }
}

