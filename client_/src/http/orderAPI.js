import {$authHost, $host} from "./index";

export const createOrder = async (formData) => {
    return await $host.post('api/orders/', formData)
}

export const fetchAlLOrders = async (page, limit, sorting, ascending, filters) => {
    return await $authHost.get('api/orders/', {params: {page, limit, sorting, ascending, filters}})
}
export const ordersStatistics = async (filters, tabs) => {
    return await $authHost.get('api/orders/statistics/', {params: {filters, tabs}})
}
export const fetchCustomerOrders = async (id, page, limit, sorting, ascending, filters) => {
    return await $authHost.get('api/orders/' + id, {params: {page, limit, sorting, ascending, filters}})
}
export const fetchMasterOrders = async (id, page, limit, sorting, ascending, filters) => {
    return await $authHost.get('api/orders/master/' + id, {
        params: {
            page,
            limit,
            sorting,
            ascending,
            filters,
        }
    })
}

export async function downloadExcel(sorting, ascending, filters) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/orders/exportOrder/?sorting=${sorting}&ascending=${ascending}&filters=${JSON.stringify(filters)}`)
    if (response.status === 200) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = "ordersList.xlsx"
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}

export async function downloadBill(orderId) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/orders/bill/?orderId=${orderId}`)
    if (response.status === 200) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `Bill_№${orderId}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}
export async function downloadPhotos(orderId) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/orders/downloadPhotos/?orderId=${orderId}`)
    if (response.status === 200) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `Photos_№${orderId}.zip`
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}

export const deleteOrder = async (id) => {
    return await $authHost.delete('api/orders/' + id,)

}
export const updateOrder = async (order) => {
    return await $authHost.put('api/orders/' + order.id, order)
}
export const statusChangeOrder = async (order) => {
    return await $authHost.put('api/orders/statusChange/' + order.id, order)
}
export const payPalChangeOrder = async (order) => {
    return await $host.put('api/orders/payPal' + order.id, order)
}
