export default {
    data() {
        return {
            // External
            Snackbar: {
                show: (message) => {
                    this.getDialog('snackbarManager').show(message)
                },
            },
        }
    },
}