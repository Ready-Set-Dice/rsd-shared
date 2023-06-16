const isDev = process.env.NODE_ENV !== "development" ? false : true

export default {
    data() {
        return {
            DEV: {
                log: (message) => {
                    return !!isDev ? console.log(message) : null
                }
            }
        }
    },
}