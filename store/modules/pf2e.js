export default {
    namespaced: true,
    state: {
        action: {
            count: 0,
            version: 0
        },
        ancestry: {
            count: 0,
            version: 0
        },
        ancestryFeature: {
            count: 0,
            version: 0
        },
        // archetype: {
        //     count: 0,
        //     version: 0
        // },
        background: {
            count: 0,
            version: 0
        },
        bestiary: {
            count: 0,
            version: 0
        },
        cbestiary: {
            version: 0,
            count: 0,
            owner: '',
            git: '',
        },
        class: {
            count: 0,
            version: 0
        },
        classExtended: {
            count: 0,
            version: 0
        },
        classFeature: {
            count: 0,
            version: 0
        },
        condition: {
            items: [],
            version: 0
        },
        deity: {
            count: 0,
            version: 0
        },
        domain: {
            count: 0,
            version: 0
        },
        feat: {
            count: 0,
            version: 0
        },
        heritage: {
            count: 0,
            version: 0
        },
        spell: {
            count: 0,
            version: 0
        },
        spellEffect: {
            count: 0,
            version: 0
        },
        static: {
            version: 0
        },
    },
    getters: {
        action: state => {
            return state.action
        },
        ancestry: state => {
            return state.ancestry
        },
        ancestryFeature: state => {
            return state.ancestryFeature
        },
        // archetype: state => {
        //     return state.archetype
        // },
        background: state => {
            return state.background
        },
        bestiary: state => {
            return state.bestiary
        },
        cbestiary: state => {
            return state.cbestiary
        },
        class: state => {
            return state.class
        },
        classExtended: state => {
            return state.classExtended
        },
        classFeature: state => {
            return state.classFeature
        },
        conditions: state => {
            return state.condition.items
        },
        conditionInfo: state => {
            return state.condition
        },
        deity: state => {
            return state.deity
        },
        domain: state => {
            return state.domain
        },
        feat: state => {
            return state.feat
        },
        heritage: state => {
            return state.heritage
        },
        spell: state => {
            return state.spell
        },
        spellEffect: state => {
            return state.spellEffect
        },
        static: state => {
            return state.static
        },
    },
    mutations: {
        setActionInfo(state, data) {
            state.action = data
        },
        setAncestryInfo(state, data) {
            state.ancestry = data
        },
        setAncestryFeatureInfo(state, data) {
            state.ancestryFeature = data
        },
        // setArchetypeInfo(state, data) {
        //     state.archetype = data
        // },
        setBackgroundInfo(state, data) {
            state.background = data
        },
        setBestiaryInfo(state, data) {
            state.bestiary = data
        },
        setCustomBestiaryInfo(state, data) {
            state.cbestiary = data
        },
        setClassInfo(state, data) {
            state.class = data
        },
        setClassExtendedInfo(state, data) {
            state.classExtended = data
        },
        setClassFeatureInfo(state, data) {
            state.classFeature = data
        },
        setCondition(state, data) {
            state.condition = data
        },
        setDeityInfo(state, data) {
            state.deity = data
        },
        setDomainInfo(state, data) {
            state.domain = data
        },
        setFeatInfo(state, data) {
            state.feat = data
        },
        setHeritageInfo(state, data) {
            state.heritage = data
        },
        setSpellInfo(state, data) {
            state.spell = data
        },
        setSpellEffectInfo(state, data) {
            state.spellEffect = data
        },
        setStatic(state, data) {
            state.static = data
        },
    },
    actions: {
        setActionInfo({ commit }, data) {
            commit('setActionInfo', data)
        },
        setAncestryInfo({ commit }, data) {
            commit('setAncestryInfo', data)
        },
        setAncestryFeatureInfo({ commit }, data) {
            commit('setAncestryFeatureInfo', data)
        },
        // setArchetypeInfo({ commit }, data) {
        //     commit('setArchetypeInfo', data)
        // },
        setBackgroundInfo({ commit }, data) {
            commit('setBackgroundInfo', data)
        },
        setBestiaryInfo({ commit }, data) {
            commit('setBestiaryInfo', data)
        },
        setCustomBestiaryInfo({ commit }, data) {
            commit('setCustomBestiaryInfo', data)
        },
        setClassInfo({ commit }, data) {
            commit('setClassInfo', data)
        },
        setClassExtendedInfo({ commit }, data) {
            commit('setClassExtendedInfo', data)
        },
        setClassFeatureInfo({ commit }, data) {
            commit('setClassFeatureInfo', data)
        },
        setCondition({ commit }, data) {
            commit('setCondition', data)
        },
        setDeityInfo({ commit }, data) {
            commit('setDeityInfo', data)
        },
        setDomainInfo({ commit }, data) {
            commit('setDomainInfo', data)
        },
        setFeatInfo({ commit }, data) {
            commit('setFeatInfo', data)
        },
        setHeritageInfo({ commit }, data) {
            commit('setHeritageInfo', data)
        },
        setSpellInfo({ commit }, data) {
            commit('setSpellInfo', data)
        },
        setSpellEffectInfo({ commit }, data) {
            commit('setSpellEffectInfo', data)
        },
        setStatic({ commit }, data) {
            commit('setStatic', data)
        },
    }
}