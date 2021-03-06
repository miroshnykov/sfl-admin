import {api} from './request'
import {catchHandler, reFormatJSON} from '../helpers'

const getOffers = async () => {

    try {
        console.time(`getOffers`)
        const res = await api.post(
            '', {
                query: `
                    {
                          getOffers {
                                id
                                name
                                status
                                payIn
                                payOut
                                currencyId
                                dateAdded
                                dateUpdated
                                verticalId
                                verticalName
                                advertiserName
                                isCpmOptionEnabled
                                descriptions
                                payoutPercent
                                defaultLandingPageId
                                nameLandingPage 
                                urlLandingPage
                                countOfCampaigns
                          }
                    }
            `,
            }
        )

        let response = res.data.data.getOffers
        console.log(`getOffers response count :`, response.length)
        console.timeEnd(`getOffers`)
        return response
    } catch (e) {
        console.log(e)
    }

}

export default {
    getOffers
}