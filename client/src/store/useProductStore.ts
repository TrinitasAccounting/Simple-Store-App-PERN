
import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';


const BASE_URL = "http://localhost:3000";


type Props = {
    showAdd: boolean
}


export const useProductStore = create((set, get) => ({
    // product state
    products: [],
    loading: false,
    error: null,
    currentProduct: null,     //product that is currently clicked or selected

    //Add a product form state
    formData: {
        name: "",
        price: "",
        image: ""
    },

    // Showing a pop up and not showing a pop up states, 2 lines below
    showAdd: false,
    toggleShowAdd: () => set((state) => ({ showAdd: !state.showAdd })),

    //THis is essentially our onChange handler
    setFormData: (formData) => set({ formData }),
    //Reseting the form once submitted
    resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

    //POST fetch
    addProduct: async (event: any) => {
        event.preventDefault();
        set({ loading: true })
        try {
            const { formData } = get()    // we can destructure and get any value that is currently inside of the store such as "loading" etc.
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();    // re-fetching the products once we have added a new product
            get().resetForm()    // calling the resetform function to make the formData empty again
            toast.success("Product added successfully")

            //closing the pop up
            // document.getElementById("add_product_modal")?.close();     //does not work

        } catch (error) {
            console.log("Error in addProduct function")
            toast.error("Something went wrong")
        }
        finally {
            set({ loading: false })
        }

    },

    //GET fetch
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

    //DELETE fetch
    deleteProduct: async (id: number) => {
        set({ loading: true });
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set((prev: any) => ({ products: prev.products.filter((product: any) => product.id !== id) }))
            toast.success("Product deleted successfully")
        } catch (error) {
            console.log("Error in deleteProdict function", error)
            toast.error("Something went wrong")
        }
        finally {
            set({ loading: false })
        }
    },

    //GET(id) fetching individual product
    fetchProduct: async (id: number) => {
        set({ loading: true })
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`)
            set({
                currentProduct: response.data.data,
                formData: response.data.data,    //this prefills our form with the currentProduct data 
                error: null,
            })


        } catch (error) {
            console.log("Error in fetch Product", error)
            set({ error: "Something went wrong", currentProduct: null })
        }
        finally {
            set({ loading: false })
        }
    },

    //PUT fetch 
    updateProduct: async (id: number) => {
        set({ loading: true });
        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData)
            set({ currentProduct: response.data.data })
            toast.success("Product updated successfully")


        } catch (error) {
            toast.error("Somethign went wrong");
            console.log("Error in update Product function", error);
        }
        finally {
            set({ loading: false })
        }

    }




}))




