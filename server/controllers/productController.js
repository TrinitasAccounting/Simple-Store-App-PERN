
import { sql } from "../config/db.js"


//GET for all products
export const getProducts = async (req, res) => {
    try {
        const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;

        console.log("Fetched products:", products)
        res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log("error in getProducts", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


//GET(:id) for getting one product
export const getProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await sql`
            SELECT * FROM products 
            WHERE products.id = ${id}
        `

        res.status(200).json({ success: true, data: product[0] })

    } catch (error) {
        console.log("error in getProduct", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


//POST function to create a product
export const createProduct = async (req, res) => {
    const { name, price, image } = req.body      //because we have the middleware of app.use(express.json()) in our server.js file, we can destructure the fields we want

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }

    try {
        const newProduct = await sql`
            INSERT INTO products (name, price, image) 
            VALUES (${name}, ${price}, ${image})
            RETURNING *
        `

        // console.log("new product added: ", newProduct)
        res.status(201).json({ success: true, data: newProduct[0] })    //This is because the newProduct is returned as an array for some reason. Hover over it to find out more and if its an array

    } catch (error) {
        console.log("Error in createProducts function", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


//PUT for updating a product, and PUT requires all fields to be passed in
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    try {
        const updateProduct = await sql`
            UPDATE products
            SET name=${name}, price=${price}, image=${image}
            WHERE id = ${id}
            RETURNING *
        `

        if (updateProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({ success: true, data: updateProduct[0] })

    } catch (error) {
        console.log("Error in updateProducts function", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}


//DELETE for deleting a product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await sql`
            DELETE FROM products 
            WHERE id = ${id}
            RETURNING *
        `

        if (deletedProduct === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(204).json({ success: true, data: deletedProduct })

    } catch (error) {
        console.log("Error in deleteProducts function", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }


}


