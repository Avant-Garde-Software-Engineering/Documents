import Product from "@_model/Product"

export const productsSlice = (set, get) => ({
	products: [],

	setProducts: (products) => set({ products: products }),

	addProduct: (name, color) => {
		const newProduct = new Product(name, color);

		set((state) => ({
			products: [...state.products, newProduct]
		}));
	},

	removeProduct: (id) => {    
		set((state) => ({
			products: state.products.filter(product => product.id !== id)
		}));

		const binIds = get().getBinsWithProduct(id);
		for(let i = 0; i < binIds.length; i++){
			const data = binIds[i].split('-');
			const shelfId = data[0];
			const row = data[1];
			const col = data[2];
			get().removeProductFromBin(shelfId, row, col);
		}
	},

	updateColor: (id, color) => {
		set((state) => ({
			products: state.products.map((product) => {
				if(product.id === id) {
					product.color = color;
				}
				return new Product(product.name, product.color, product.id);
			}),
		}));
	},

	updateName: (id, name) => {
		set((state) => ({
			products: state.products.map((product) => {
				if(product.id === id) {
					product.name = name;
				}
				return new Product(product.name, product.color, product.id);
			}),
		}));
	},
})