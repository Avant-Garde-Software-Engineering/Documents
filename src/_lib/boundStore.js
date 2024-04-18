import { create } from 'zustand'
import { createWhsSlice } from './whsSlice'
import { createShelvesSlice } from './shelvesSlice'
import { createProductsSlice } from './productsSlice'
import { createInteractionsSlice } from './interactionsSlice'


export const useBoundStore = create((...a) => ({
	...createWhsSlice(...a),
	...createShelvesSlice(...a),
	...createProductsSlice(...a),
	...createInteractionsSlice(...a),
}))