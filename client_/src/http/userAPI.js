import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (userData) => {
    await $host.post('api/users/registration/', userData)

}
export const registrationFromAdmin = async (userData) => {
    await $host.post('api/users/registrationAdmin/', userData)
}

export const login = async (dataForAuthorizations) => {
    const {data} = await $host.post('api/users/login/', {dataForAuthorizations})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const googleAuth = async (dataForAuthorizations) => {
    const {data} = await $host.post('api/users/googleAuth/', {dataForAuthorizations})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const facebookAuth = async (dataForAuthorizations) => {
    const {data} = await $host.post('api/users/facebookAuth/', {dataForAuthorizations})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/users/auth/')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const checkEmail = async (email) => {
    return await $host.get('api/users/checkEmail/', {params: {email: email}})
}
export const updateEmail = async (email, exampleEmail) => {
    const {data} = await $host.put('api/users/changeEmail/', {email, exampleEmail})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const fetchUsers = async (page, limit, sorting, ascending) => {
    return await $authHost.get('api/users/', {params: {page, limit, sorting, ascending}})
}
export const fetchCustomers = async (page, limit, sorting, ascending, inputValue) => {
    return await $authHost.get('api/users/customers/', {params: {page, limit, sorting, email: inputValue}})
}
export const deleteUser = async (id) => {
    await $authHost.delete('api/users/' + id,)
}
export const updateUser = async (userId, data) => {
    await $authHost.put('api/users/' + userId, data)
}
export const activateUser = async (user) => {
    await $authHost.put('api/users/activate/' + user.id, user)

}