import {$authHost, $host} from "./index";


export const createMaster = async (master) => {
    await $authHost.post('api/masters/admin/', master)
}

export const fetchMasters = async (cityId, page, limit, sorting, ascending, filters, inputValue) => {
    return await $host.get('api/masters/', {
        params: {
            cityId,
            page,
            limit,
            sorting,
            ascending,
            filters,
            name: inputValue
        }
    })
}
export const fetchMastersForOrder = async (cityId, time, sizeClock, page, limit) => {
    return await $host.get('api/masters/' + cityId, {params: {cityId, time, sizeClock, page, limit}})
}

export const deleteMaster = async (id) => {
    await $authHost.delete('api/masters/' + id,)

}
export const updateMaster = async (master) => {
    await $authHost.put('api/masters/' + master.id, master)

}
export const activateMaster = async (master) => {
    await $authHost.put('api/masters/activate/' + master.id, master)

}
export const ratingMaster = async (post) => {
    await $host.put('api/masters/rating/' + post.uuid, post)
}
export const checkLink = async (uuid) => {
    await $host.get('api/masters/rating/link/' + uuid)
}
export const fetchReviews = async (masterId) => {
    return await $host.get('api/masters/rating/' + masterId)
}