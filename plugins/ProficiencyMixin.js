export default {
    data() {
        return {
            // External
            Proficiency: {
                get: {
                    bonus: (level, proficiency) => {
                        return proficiency > 0
                        ? level + (proficiency*2)
                        : 0
                    },
                    type: (proficiency) => {
                        if (!!proficiency) {
                            if (proficiency == 1) {
                                return 'Trained'
                            } else if (proficiency == 2) {
                                return 'Expert'
                            } else if (proficiency == 3) {
                                return 'Master'
                            } else if (proficiency == 4) {
                                return 'Legendary'
                            }
                        }
                        return 'Untrained'
                    },
                    typeShort: (proficiency) => {
                        if (!!proficiency) {
                            if (proficiency == 1) {
                                return 'T'
                            } else if (proficiency == 2) {
                                return 'E'
                            } else if (proficiency == 3) {
                                return 'M'
                            } else if (proficiency == 4) {
                                return 'L'
                            }
                        }
                        return ''
                    },
                    typeIcon: (proficiency) => {
                        if (!!proficiency) {
                            if (proficiency == 1) {
                                return 'mdi-circle-slice-2'
                            } else if (proficiency == 2) {
                                return 'mdi-circle-slice-4'
                            } else if (proficiency == 3) {
                                return 'mdi-circle-slice-6'
                            } else if (proficiency == 4) {
                                return 'mdi-circle-slice-8'
                            }
                        }
                        return ''
                    }
                }
            },
            AbilityScore: {
                get: {
                    modifier: (score) => {
                        return !!score ? Math.floor((score-10)/2) : 0
                    }
                }
            },
            Skills: {
                get: {
                    modifier: (score, level, proficiency) => {
                        return this.m_getProficiencyModifier(score, level, proficiency)
                    }
                }
            },
            Saves: {
                get: {
                    modifier: (score, level, proficiency) => {
                        return this.m_getProficiencyModifier(score, level, proficiency)
                    }
                }
            }
        }
    },
    methods: {
        m_getProficiencyModifier(score, level, proficiency) {
            return (!!score || score == 0) && !!level && (!!proficiency || proficiency == 0) ? score + this.Proficiency.get.bonus(level, proficiency) : 0
        }
    },
}