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
import axios from "axios";

global.fetch = jest.fn()
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
        fetchReviews: () => Promise.resolve({data: {count: 0}}),
    };
})
jest.mock('../http/masterApi', () => {
    const originalModule = jest.requireActual('../http/masterApi');
    return {
        __esModule: true,
        ...originalModule,
        fetchMastersForOrder: () => Promise.resolve({
            data: {
                count: 4, rows: [{
                    id: 1,
                    isActivated: true,
                    name: "Валера",
                    rating: 4,
                    userId: 1,
                    cities: [{id: 1, name: "Днепр", price: 1}]
                },{
                    id: 2,
                    isActivated: true,
                    name: "Игорь",
                    rating: 4,
                    userId: 2,
                    cities: [{id: 1, name: "Днепр", price: 1}]
                },{
                    id: 3,
                    isActivated: true,
                    name: "Тракса",
                    rating: 4,
                    userId: 3,
                    cities: [{id: 1, name: "Днепр", price: 1}]
                },{
                    id: 4,
                    isActivated: true,
                    name: "Урса",
                    rating: 4,
                    userId: 4,
                    cities: [{id: 1, name: "Днепр", price: 1}]
                }]
            }
        }),
    };
})


describe('master check', () => {
    beforeEach(async () => {
        await act(async () => render(
            <Provider store={store}>
                <MemoryRouter>
                    <AppRouter/>
                    <Order/>
                </MemoryRouter>
            </Provider>
        ))
        const email = screen.getByTestId("email-textField")
        const selectorCity = await screen.findByLabelText("SelectorCity.label")
        const selectorSize = await screen.findByLabelText("SizeClocks.label")
        const buttonNextPage = screen.getByTestId("buttonNextPage")
        userEvent.type(screen.getByTestId("name-textField"), 'Vasya')
        userEvent.type(email, 'wasd@sad.com')
        userEvent.click(selectorSize)
        const optionsPopupSize = await screen.findByRole("listbox", {
            name: "SizeClocks.label"
        });
        userEvent.click(within(optionsPopupSize).getByText(/Маленькие/i));
        userEvent.click(selectorCity)
        const optionsPopupCities = await screen.findByRole("listbox", {
            name: "SelectorCity.label"
        });
        userEvent.click(within(optionsPopupCities).getByText(/Dnepr/i));
        userEvent.click(buttonNextPage)
        userEvent.click((within(await screen.findByTestId('popover')).getByText(/OrderStepper.yesButton/i)))
        await act(async () => {
            await waitFor(() => {
                userEvent.click(buttonNextPage)
            })
        })
    })

    test("master choose", async () => {
        expect((await screen.findAllByTestId('masterList'))[0]).not.toHaveClass('Mui-selected')
        await act(async () => userEvent.click((await screen.findAllByTestId('masterList'))[0]))
        expect((await screen.findAllByTestId('masterList'))[0]).toHaveClass('Mui-selected')

        expect((await screen.findAllByTestId('masterList'))[1]).not.toHaveClass('Mui-selected')
        await act(async () => userEvent.click((await screen.findAllByTestId('masterList'))[1]))
        expect((await screen.findAllByTestId('masterList'))[1]).toHaveClass('Mui-selected')
    })

    test("modal review", async () => {
        expect( screen.queryByTestId('modalReviews')).not.toBeInTheDocument()
        userEvent.click((await screen.findAllByTestId('reviewButton'))[0])
        expect(await screen.findByTestId('modalReviews')).toBeInTheDocument()
    })

    test("button next", async () => {
        expect( await screen.findByTestId("goToNext")).toHaveClass('Mui-disabled')
        await act(async () => userEvent.click((await screen.findAllByTestId('masterList'))[0]))
        expect( await screen.findByTestId("goToNext")).not.toHaveClass('Mui-disabled')
    })
    test("pagination", async () => {
        expect(await screen.findByLabelText("page 1")).toHaveClass('Mui-selected')
        expect(await screen.findByLabelText("Go to page 2")).not.toHaveClass('Mui-selected')
        await act(async () => userEvent.click(await screen.findByLabelText("Go to page 2")))
        expect(await screen.findByLabelText("page 2")).toHaveClass('Mui-selected')

        expect(await screen.findByLabelText("Go to page 1")).not.toHaveClass('Mui-selected')
        await act(async () => userEvent.click(await screen.findByLabelText("Go to previous page")))
        expect(await screen.findByLabelText("page 1")).toHaveClass('Mui-selected')
    })
})