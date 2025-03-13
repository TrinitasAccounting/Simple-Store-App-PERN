
import { create } from 'zustand';
import axios from 'axios';


const BASE_URL = "http://localhost:3000";


export const useProductStore = create((set, get) => ({
    // product state
    products: [],
    loading: false,
    error: null,
    fetchProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products`)    //GET fetch of all of our products
            set({ products: response.data.data, error: null })      // this .data.data is because in our backend controller, we are returning it in .json({success: true, data: products}). The first .data is coming from Axios

        } catch (err: any) {
            if (err.status == 429) {
                set({ error: "Rate limit exceeded", products: [] })    // the products: []   is just making sure the products that were already fetched do not show up if the bot rate limit is exceeded
            }
            else {
                set({ error: "Something went wrong", products: [] })
            }

        }
        finally {
            set({ loading: false });
        }
    },




}))




