import {
    act,
    render,
    screen,
    waitFor,
    within
} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from "react-router-dom"
import Order from "../pages/Order";
import React from "react";
import AppRouter from "../components/AppRouter";
import {store} from "../store";
import {Provider} from "react-redux";
import userEvent from "@testing-library/user-event";
import {addDays, format} from "date-fns";
import axios from "axios";
import ruLocale from "date-fns/locale/ru";

jest.mock('axios')
jest.mock('../http/cityAPI', () => {
    const originalModule = jest.requireActual('../http/cityAPI');
    return {
        __esModule: true,
        ...originalModule,
        fetchCities: () => Promise.resolve({
            data: {
                count: 1, rows: [{
                    name: "Dnepr",
                    id: 1,
                    price: 11
                }]
            }
        }),
    };
})

jest.mock('../http/sizeApi', () => {
    const originalModule = jest.requireActual('../http/sizeApi');
    return {
        __esModule: true,
        ...originalModule,
        fetchSize: () => Promise.resolve({
            data: {
                count: 1, rows: [{
                    id: 1,
                    name: "Маленькие",
                    date: '01:00:00'
                }]
            }
        }),
    };
})
jest.mock('../http/userApi', () => {
    const originalModule = jest.requireActual('../http/userApi');
    return {
        __esModule: true,
        ...originalModule,
        checkEmail: () => Promise.resolve({status: 204}),
    };
})
jest.mock('../http/masterApi', () => {
    const originalModule = jest.requireActual('../http/masterApi');
    return {
        __esModule: true,
        ...originalModule,
        fetchMastersForOrder: () => Promise.resolve({
            data: {
                count: 1, rows: [{
                    id: 1,
                    isActivated: true,
                    name: "Валера",
                    rating: 4,
                    userId: 1,
                    cities: [{id: 1, name: "Днепр", price: 1}]
                }, {
                    id: 2,
                    isActivated: true,
                    name: "Игорь",
                    rating: 4,
                    userId: 2,
                    cities: [{id: 1, name: "Днепр", price: 1}]
                }]
            }
        }),
    };
})

describe('order form', () => {
    let file;
    beforeAll(() => {
        file = new File(["(⌐□_□)"], "chucknorris.png", {type: "image/png"});
    })
    beforeEach(async () => {
        await act(async () => render(
            <Provider store={store}>
                <MemoryRouter>
                    <AppRouter/>
                    <Order/>
                </MemoryRouter>
            </Provider>
        ))
    })

    test("Right form", async () => {
        const email = screen.getByTestId("email-textField")
        const selectorCity = await screen.findByLabelText("SelectorCity.label")
        const selectorSize = await screen.findByLabelText("SizeClocks.label")
        const datePicker = screen.getByLabelText("OrderStepper.date")
        const buttonAddPhoto = screen.getByTestId("addPhoto")
        const buttonNextPage = screen.getByTestId("buttonNextPage")

        userEvent.type(screen.getByTestId("name-textField"), 'Vasya')
        expect(screen.getByTestId("name-textField").value).toBe("Vasya")
        expect(screen.getByTestId("name-textField")).toBeValid()

        userEvent.type(email, 'wasd@sad.com')
        expect(screen.getByTestId("email-textField").value).toBe("wasd@sad.com")
        expect(screen.getByTestId("email-textField")).toBeValid()

        userEvent.click(selectorSize)
        const optionsPopupSize = await screen.findByRole("listbox", {
            name: "SizeClocks.label"
        });
        userEvent.click(within(optionsPopupSize).getByText(/Маленькие/i));
        expect(await screen.findByText(/Маленькие/i)).toHaveTextContent(/Маленькие/i)
        expect(await screen.findByText(/Маленькие/i)).toBeValid()

        userEvent.click(selectorCity)
        const optionsPopupCities = await screen.findByRole("listbox", {
            name: "SelectorCity.label"
        });
        userEvent.click(within(optionsPopupCities).getByText(/Dnepr/i));
        expect(await screen.findByText(/Dnepr/i)).toHaveTextContent(/Dnepr/i)
        expect(await screen.findByText(/Dnepr/i)).toBeValid()

        userEvent.click(datePicker)
        await waitFor(() => screen.queryByRole('dialog'))
        userEvent.click(screen.getByLabelText(format(addDays(new Date(), 1), 'd LLL yyyy г.', {locale: ruLocale})));
        expect(screen.getByLabelText("OrderStepper.date").value).toBe(addDays(new Date(), 1).toLocaleDateString("uk-Ua"))

        expect(screen.queryByTestId("Photo")).toBeNull()
        await act(async () => {
            await waitFor(() => {
                userEvent.upload(buttonAddPhoto, file);
            });
        });
        let image = await screen.findByTestId("Photo")
        expect(image).toBeInTheDocument()
        expect(screen.getByTestId("formOrder")).toBeValid()
        userEvent.click(buttonNextPage)
        userEvent.click((within(await screen.findByTestId('popover')).getByText(/OrderStepper.yesButton/i)))
    })

    test("empty name", async () => {
        expect(screen.getByTestId("name-textField").value).toBe('')
        expect(screen.getByTestId("name-textField")).toBeInvalid()
    })

    test("invalid email", async () => {
        userEvent.type(screen.getByTestId("email-textField"), 'clcs')
        expect(screen.getByTestId("email-textField").value).toBe("clcs")
        expect(screen.getByTestId("email-textField")).toBeInvalid()
    })
    test("empty email", async () => {
        expect(screen.getByTestId("email-textField").value).toBe("")
        expect(screen.getByTestId("email-textField")).toBeInvalid()
    })
})