import {$authHost, $host} from "./index";


export const createCity = async (city) => {
    return await $authHost.post('api/cities/', city)
}

export const fetchCities = async (page, limit, sorting, ascending, inputValue) => {
    return await $host.get('api/cities/', {params: {page, limit, sorting, ascending, name: inputValue}})

}

export const deleteCity = async (id) => {
    await $authHost.delete(`api/cities/` + id)


}
export const updateCity = async (cityInfo) => {
    return await $authHost.put('api/cities/' + cityInfo.id, cityInfo)
}