import {api} from './request'
import {reFormatJSON, catchHandler} from '../helpers'

const segments = async () => {

    try {
        const res = await api.post(
            '', {
                query: `
                {
                    segments{
                        id
                        name
                        dateAdded
                        dateAddedUnixTime
                        position
                    } 
                }
            `,
            }
        )
        debugger

        let response = res.data.data.segments
        console.log('\nsegments from DB response count:', response.length)
        return response
    } catch (e) {
        console.log(e)
    }

}


const reOrderSegmentsSave = async (data) => {

    console.log('reOrderSegmentsSave:', data)
    try {
        const res = await api.post(
            '', {
                query: `
                    mutation{
                        ordering(
                            reordering: 
                                ${data}
                            
                        ) {
                            id
                            position
                        }
                    }
            `,
            }
        )

        let response = res.data.data
        console.log('\nsegments reordering from DB response count:', response.length)
        return response
    } catch (e) {
        console.log(e)
    }

}


const deleteSegment = async (id) => {

    console.log('deleteSegment:', id)
    try {

        const res = await api.post(
            '', {
                query: `
                mutation{
                      deleteSegment(
                            id:${id}
                      ){
                            id
                      }
                }`,
            }
        )

        let response = res.data.data.deleteSegment
        console.log('\nsegments reordering from DB response count:', response.length)
        return response
    } catch (e) {
        console.log(e)
    }
}

const createSegment = async (name) => {

    console.log('createSegment:', name)
    try {
        const res = await api.post(
            '', {
                query: `
                mutation{
                      createSegment(
                            name:"${name}"
                      ){
                            id
                      }
                }`,
            }
        )

        let response = res.data.data.createSegment
        console.log('\nsegments reordering from DB response count:', response.length)
        return response
    } catch (e) {
        console.log(e)
    }

}


export default {
    segments,
    createSegment,
    deleteSegment,
    reOrderSegmentsSave
}