import Product from "@_classes/Product"

export const createProductsSlice = (set) => ({
	products: [new Product('b')],   // test, to remove data

	setProducts: (products) => set({ products }),
	generateProductIdNo: () => {
	const lastElement = store.getState().products.slice(-1)[0];
		if (lastElement) {
			return parseInt(lastElement.id.split('_')[1]);
		} else {
			return 0;
		}
	},
	addProduct: (newProduct) => set((state) => ({ products: [...state.products, newProduct] })),
	removeProduct: (id) => {    
		set((state) => ({
			products: state.products.filter(product => product.id !== id)
	}));

	// togliere prodotto da bin?
	},
	updateColor: (id, r, g, b) => {
		set((state) => ({
			products: state.products.map((product) =>
			product.id === id ? { ...product, color: {r: r, g: g, b: b}} : product
			),
		}));
	},
	updateName: (id, name) => {
		set((state) => ({
			products: state.products.map((product) =>
			product.id === id ? { ...product, name: name} : product
			),
		}));
	},
})