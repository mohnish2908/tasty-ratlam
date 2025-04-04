import { apiConnector } from '../apiconnector';
import { productEndpoints } from '../apis';
import { toast } from 'react-hot-toast';

const { GET_PRODUCTS, 
        GET_COMBO_PRODUCTS,
        DELETE_COMBO_PRODUCT,
        DELETE_PRODUCT,
        ADD_PRODUCT,
        ADD_COMBO_PRODUCT,
        GET_COMBO_PRODUCT_BY_ID,
        GET_PRODUCT_BY_ID,
        ADD_PRODUCT_REVIEW,
        GET_PRODUCT_REVIEW
         } = productEndpoints;

export const getAllProducts = async () => {
    try {
        // toast.loading("Fetching Products...");
        const response = await apiConnector("GET", GET_PRODUCTS, null, null, null); // API call for products
        const data = await response.data; // Assuming the data comes directly as response.data
        // toast.dismiss(); // Dismiss the loading toast
        // console.log("all produdct",data)
        return { data }; // Return the data in the required format
    } catch (error) {
        toast.error("Error fetching products");
        throw error; // Rethrow the error to be caught in the component
    }
};

export const getAllComboProducts = async () => {
    try {
        // toast.loading("Fetching Combo Products...");
        const response = await apiConnector("GET", GET_COMBO_PRODUCTS, null, null, null); // API call for combo products
        const data = await response.data; // Assuming the data comes directly as response.data
        // toast.dismiss(); // Dismiss the loading toast
        return { data }; // Return the data in the required format
    } catch (error) {
        toast.error("Error fetching combo products");
        throw error; // Rethrow the error to be caught in the component
    }
};

export const deleteProduct = async (id,newStatus,adminToken) => {
    try {
        console.log("at",adminToken)
        toast.loading("Deleting Product...");
        // Call the delete API function here
        const response = await apiConnector("POST", DELETE_PRODUCT, {id}, {
            Authorization:`Bearer ${adminToken}`}, null);
        toast.dismiss();
        toast.success("Product deactivate/activate successfully");
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const deleteComboProduct = async (id,newStatus,adminToken) => {
    try {
        toast.loading("Deleting Combo Product...");
        // Call the delete API function here
        console.log("Deleting Combo Product:", id);
        const response = await apiConnector("POST", DELETE_COMBO_PRODUCT, {id}, {
            Authorization:`Bearer ${adminToken}`}, null);
        toast.dismiss();
        toast.success("Combo Product activate/deactivate successfully");
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const addProduct = async (name, description, heading, subHeadings, pricePerWeight, images,adminToken) => {
    try {
        console.log("Adding Product:", name, description, heading, subHeadings, pricePerWeight, images,adminToken);

        // Create a FormData object to send form data including files
        const formData = new FormData();

        // Append non-file data (strings and arrays)
        formData.append("name", name);
        formData.append("description", description);
        formData.append("heading", heading);

        // Append subHeadings (array of strings)
        subHeadings.forEach((subHeading, index) => {
            formData.append(`subHeadings[${index}]`, subHeading);
        });

        // Append pricePerWeight (array of objects with weight and price)
        pricePerWeight.forEach((item, index) => {
            formData.append(`pricePerWeight[${index}][weightInGrams]`, item.weightInGrams);
            formData.append(`pricePerWeight[${index}][price]`, item.price);
        });

        // Append images if present
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                formData.append("images", image);  // append each image to the FormData
            });
        }

        toast.loading("Adding Product...");

        // Send the request with FormData, no need to manually set Content-Type as browser will handle it
        const response = await apiConnector(
            "POST",
            ADD_PRODUCT,
            formData,
            {
                Authorization:`Bearer ${adminToken}`},  // No need to set Content-Type, it's handled by FormData
            null
        );

        toast.dismiss();
        toast.success("Product added successfully");
        return response;
    } catch (error) {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error adding product");
        console.error("Error:", error);
        throw error;
    }
};


export const addComboProduct = async (formData,adminToken) => {
    try{
        // console.log("Adding Combo Product:", name, description, heading, subHeadings, price, images, products,weightInGrams);
        console.log(formData)
        // const formData = new FormData();
        // formData.append("name", name);
        // formData.append("description", description);
        // formData.append("heading", heading);
        // subHeadings.forEach((subHeading, index) => {
        //     formData.append(`subHeadings[${index}]`, subHeading);
        // });
        // formData.append("price", price);
        // if(images && images.length > 0){
        //     images.forEach((image, index) => {
        //         formData.append("images", image);
        //     });
        // }
        // products.forEach((product, index) => {
        //     formData.append(`products[${index}]`, product);
        // });
        toast.loading("Adding Combo Product...");
        const response = await apiConnector(
            "POST",
            ADD_COMBO_PRODUCT,
            formData,
            {
                Authorization:`Bearer ${adminToken}`
            },
            null
        );
        toast.dismiss();
        toast.success("Combo Product added successfully");
        return response;
    }
    catch(error){
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error adding combo product");
        console.error("Error:", error);
        throw error;
    }
}

export const getProductById = async (id) => {
    try {
      console.log("Fetching product details for ID:", id);
      const response = await apiConnector("GET", `${GET_PRODUCT_BY_ID}/${id}`, null, null, null);
      const data = await response.data;
      return { data };
    } catch (error) {
      toast.error("Error fetching product details");
      throw error;
    }
  };

export const getComboProductById = async (id) => {
    try {
        // toast.loading("Fetching Combo Product...");
        const response = await apiConnector("GET",`${GET_COMBO_PRODUCT_BY_ID}/${id}`,  null , null, null);
        const data = await response.data;
        // toast.dismiss();
        return { data };
    } catch (error) {
        toast.error("Error fetching combo product details");
        throw error;
    }
}

export const createRating = async (productId, name, rating, title, review,comboProductId) => {
    try {
        // console.log("Creating Rating:", productId, name, rating, title, review,comboProductId);
        const response = await apiConnector("POST", ADD_PRODUCT_REVIEW, { productId, name, rating, title, review,comboProductId }, null, null);
        toast.success("Rating added successfully");
        return response.data;
    } catch (error) {
        toast.error("Error adding rating");
        throw error;
    }
}

export const getAllReviews = async () => {
    try{
        const response = await apiConnector("GET", GET_PRODUCT_REVIEW, null, null, null);
        const data = await response.data.data;
        console.log("All Reviews:", data);
        return { data };
    }
    catch(error){
        console.log("Error:", error);
    }
}