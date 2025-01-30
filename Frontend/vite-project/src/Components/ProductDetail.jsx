import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductDetail({ props }) {
    const { id } = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/products/listProduct/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchProduct();
    }, [id]);

    return (
        <div key={product.car?._id} className="md:flex md:justify-center p-2 m-2">
           
            <div className="image">
            <h1 className="font-bold text-center p-2 m-2 text-3xl">Product Details</h1>
                {product.car?.images?.[0] && (
                    <img src={product.car.images[0]} alt={product.car.title} className="w-full h-auto" />
                )}
            </div>
            <div className="details md:mt-20 md:ml-20 ">
                <h1 className="font-bold italic ">{product.car?.title}</h1><br/>
                <p className="font-bold">{product.car?.description}</p><br/>
                <p className="font-bold">Price: ₹{product.car?.price.toLocaleString()}</p><br/>
                <div>
                    <strong>Tags:</strong> {product.car?.tags?.join(", ")}
                </div>
            </div>
        </div>
    );
}
