import {reFormatJSON, capitalizeFirstLetter, cloneObjectArray} from '../helpers'
import offer from '../api/offer'

const geoRulesFormat = (geo) => {
    let geoRules = {}
    geoRules.geo = geo
    return JSON.stringify(geoRules)
}

const customLPRulesFormat = (customLPRules) => {
    let customLp = {}
    customLp.customLPRules = customLPRules
    return JSON.stringify(customLp)
}

const newCap = () => {
    let cap = {}
    cap.clickDay = 0
    cap.clickMonth = 0
    cap.clickWeek = 0
    cap.clicksRedirectOfferId = 0
    cap.clicksRedirectOfferUseDefault = 1
    cap.clicksRedirectStatus = 0
    cap.offerId = 0
    cap.salesDay = 0
    cap.salesMonth = 0
    cap.salesRedirectOfferId = 0
    cap.salesRedirectOfferUseDefault = 1
    cap.salesRedirectStatus = 0
    cap.salesWeek = 0
    return cap
}

export default {
    state: {
        offer: {},
        offerOrigin: {},
        offerCap: {},
        offerCapOrigin: {},
        geo: [],
        geoOrigin: [],
        customLPRules: [],
        customLPRulesOrigin: [],
    },
    namespaced: true,
    mutations: {
        async saveOffer(state, offer) {
            state.offer = Object.assign({}, offer)
            state.offerOrigin = Object.assign({}, offer)
            // state.offerOrigin = cloneObjectArray(offer)
            if (offer.geoRules) {
                let geoRules = JSON.parse(offer.geoRules)
                state.geo = geoRules.geo
                state.geoOrigin = cloneObjectArray(geoRules.geo)
            }
            if (offer.customLPRules) {
                let customLPRules = JSON.parse(offer.customLPRules)
                state.customLPRules = customLPRules.customLPRules
                state.customLPRulesOrigin = cloneObjectArray(customLPRules.customLPRules)
            }
        },
        async saveOfferCap(state, offerCap) {
            state.offerCap = Object.assign({}, offerCap)
            state.offerCapOrigin = Object.assign({}, offerCap)
        },
        addCustomLP(state) {
            let position = state.customLPRules.length !== 0 && state.customLPRules.length || 0
            state.customLPRules.push({id: 0, pos: position, country: '', lpName: '', lpUrl: ''})
            state.offer.customLPRules = customLPRulesFormat(state.customLPRules)
        },
        updateCustomLP(state, data) {

            let customLpRulesMap = state.customLPRules.map(item => {
                if (item.pos === data.position) {
                    item[data.field] = data.value
                }
                return item
            })
            state.offer.customLPRules = customLPRulesFormat(customLpRulesMap)

        },
        preSaveCustomLP(state) {

            state.offer.customLPRules = customLPRulesFormat(state.customLPRules)
            state.customLPRulesOrigin = cloneObjectArray(state.customLPRules)
            // console.table(reFormatJSON(state.customLPRulesOrigin))
        },
        cancelCustomLP(state) {

            state.offer.customLPRules = customLPRulesFormat(state.customLPRulesOrigin)
            state.customLPRules = cloneObjectArray(state.customLPRulesOrigin)
            // console.table(reFormatJSON(state.customLPRulesOrigin))
        },
        delCustomLP(state, position) {

            state.customLPRules = state.customLPRules
                .filter(item => (item.pos !== position))
                .map((item, index) => {
                    item.pos = index
                    return item
                })

            state.offer.customLPRules = customLPRulesFormat(state.customLPRules)

        },
        async updOffer(state, data) {
            state.offer[data.fieldName] = data.value
        },
        updOfferCap(state, data) {

            if (state.offerCap.length !== 0) {
                state.offerCap[data.fieldName] = data.value
            } else {
                let newEmptyCap = newCap()
                newEmptyCap[data.fieldName] = data.value
                state.offerCap = Object.assign({}, newEmptyCap)
            }
        },
        preSaveCap(state) {
            state.offerCapOrigin = Object.assign({}, state.offerCap)
            // state.offerCapOrigin = cloneObjectArray(state.offerCap)
        },
        cancelCap(state) {
            //state.offerCap = cloneObjectArray(state.offerCapOrigin)
            state.offerCap = Object.assign({}, state.offerCapOrigin)
        },
        allowAll(state) {
            state.geo = []
            state.offer.geoRules = geoRulesFormat(state.geo)
        },
        banAll(state, countries) {
            countries.forEach(item => {
                let countryCheck = state.geo.filter(g => (g.country === item.code))
                if (countryCheck.length === 0) {
                    state.geo.push({country: item.code, include: true})
                }
            })
            state.offer.geoRules = geoRulesFormat(state.geo)

        },
        changeGeo(state, geo) {
            if (geo.checked) {
                state.geo.push({country: geo.countryCode, include: geo.checked})
            } else {
                state.geo = state.geo.filter(item => {
                    return item.country !== geo.countryCode
                })
            }

            state.offer.geoRules = geoRulesFormat(state.geo)

            // let offerRules = {}
            // offerRules.geo = state.geo
            // let offerRulesStr = JSON.stringify(offerRules)
            // state.offer[0].geoRules = offerRulesStr

        },
        preSaveGeo(state) {

            state.offer.geoRules = geoRulesFormat(state.geo)
            state.geoOrigin = cloneObjectArray(state.geo)
            // console.table(reFormatJSON(state.customLPRulesOrigin))
        },
        cancelGeo(state) {

            state.offer.geoRules = geoRulesFormat(state.geoOrigin)
            state.geoOrigin = cloneObjectArray(state.geoOrigin)
            // console.table(reFormatJSON(state.customLPRulesOrigin))
        },
    },
    actions: {
        async saveOfferDb({commit}, defaultSiteName) {

            let data = this.getters['offer/getOffer']
            data.caps = this.getters['offer/getOfferCap'] || ''
            data.lp = this.getters['lpOffers/getLpOffers'] || ''
            data.defaultSiteName = defaultSiteName
            if (data.lp.length === 0) {
                alert(`Landing page is empty`)
                return
            }
            let res = await offer.saveOffer(data)
            return res
        },
        async saveOfferStore({commit}, id) {
            commit('saveOffer', await offer.getOffer(id))
        },
        async saveOfferCapStore({commit}, offerId) {
            commit('saveOfferCap', await offer.getOfferCap(offerId))
        },
        async createOffer({commit}, data) {
            const {name} = data
            return await offer.createOffer(name)
        },
        async delOffer({commit}, data) {
            const {id} = data
            return await offer.delOffer(id)
        },
    },
    getters: {
        getOffer: state => state.offer,
        getOfferOrigin: state => state.offerOrigin,
        getOfferCap: state => state.offerCap,
        getOfferCapOrigin: state => state.offerCapOrigin,
        getOfferGeo: state => state.geo,
        getOfferGeoOrigin: state => state.geoOrigin,
        getCustomLPRules: state => state.customLPRules,
        getCustomLPRulesOrigin: state => state.customLPRulesOrigin
    },

};
