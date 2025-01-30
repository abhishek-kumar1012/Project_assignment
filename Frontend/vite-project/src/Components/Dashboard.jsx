import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Import react-slick component
import "slick-carousel/slick/slick.css"; // Import slick-carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Import slick-carousel theme CSS
import { MdOutlineDeleteOutline } from "react-icons/md";
import { GoPencil } from "react-icons/go";

export default function Dashboard() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search,setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCars();
    }, []);

    async function fetchCars() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/products/listProducts`);
            setCars(response.data.Allcars);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log("Error while fetching cars from database", e);
        }
    }

    async function SearchSpecificCar(){

    }
    
    async function DeleteCar(carid) {
        let action=confirm('Are you sure to Delete this Car?');
        const token=localStorage.getItem('token');
        if(!action) return;
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/products/deleteProduct/${carid}`,{
                headers:{
                    token
                }
            });
            if (response.status === 200) {
                alert('Car deleted successfully');
                fetchCars(); // Refresh the list after deletion
            }
        } catch (error) {
            if(error.response.data.message=="Token is required"){
                alert("You don't have access to Delete the product");
                return;
              }
            alert('Something went wrong. Please try again later.');
        }
    }

    return (
        <>
            {loading ? (
                <>Loading...</>
            ) : (
                <div className="bg-black h-fit  md:h-full">
                    <div className="mb-5">
                        <h2 className="p-3 text-white text-xl md:text-2xl md:text-center lg:text-3xl md:pl-3 italic font-bold">
                            Manage your Car Application
                        </h2>
                        <button
                            className="fixed right-2 top-2 mb-2 p-2 font-bold cursor-pointer border border-white rounded-md bg-white"
                            onClick={() => navigate('/addcar')}
                        >
                            Add Car
                        </button>
                    </div>
                    <div className="flex justify-center m-5">
                        <input type="text" placeholder="Search for any keyword" className="px-5 py-2  md:w-1/2" onChange={(e)=>setSearch(e.target.value)} />
                        <button className="bg-white text-black font-bold cursor-pointer px-5 py-2 border border-l border-2-black" onClick={()=>SearchSpecificCar}>Search</button>
                    </div>
                    <div className="flex justify-center flex-wrap mt-4">
                        {cars && cars.map((car) => {
                            const isSingleImage = car.images.length === 1;
                            const sliderSettings = {
                                dots: true,
                                infinite: !isSingleImage, // Disable infinite loop if only one image
                                speed: 500,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                autoplay: !isSingleImage, // Optional: Disable autoplay if only one image
                                autoplaySpeed: 3000,
                            };

                            return (
                                <div key={car._id} className="border border-white rounded-lg my-4 p-4 w-5/6 md:h-1/3 md:w-3/4">
                                    <Slider {...sliderSettings}>
                                        {car.images.map((image, index) => (
                                            <div key={index}>
                                                <img src={image} alt={`Slide ${index}`} className="w-full h-48 md:h-2/4 object-cover" />
                                            </div>
                                        ))}
                                    </Slider>
                                    <h1 className="text-white uppercase text-2xl font-semibold font-sans text-center md:text-4xl">
                                        {car.title}
                                    </h1>
                                    <h3 className="text-white overflow-auto my-2 p-2 md:text-2xl">{car.description}</h3>
                                    <h2 className="text-white font-bold p-2 md:text-xl">₹{car.price}</h2>
                                    <h1 className="text-white p-2 md:text-xl">Tags</h1>
                                    <div className="tag flex flex-wrap">
                                        {car.tags.map((tag, index) => (
                                            <div key={index} className="m-2 p-2 border border-white rounded-lg">
                                                <h3 className="text-white font-bold">{tag}</h3>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between m-2 mb-4">
                                        {/* <button className="p-2 m-2 cursor-pointer border border-white bg-white rounded-md font-semibold uppercase">
                                            Book Test Drive
                                        </button> */}
                                        <button className="p-2 m-2 cursor-pointer border border-white bg-white rounded-md font-semibold uppercase" onClick={()=>{
                                            navigate(`/productdetail/${car._id}`)
                                        }}>
                                            View Details
                                        </button>
                                        <div className="md:flex">
                                        <GoPencil className="cursor-pointer m-2 p-2  text-4xl bg-green-500"
                                        onClick={()=>navigate(`/editdetails/${car._id}`)}
                                        />
                                        <MdOutlineDeleteOutline  
                                            onClick={() => DeleteCar(car._id)}
                                            className="bg-red-800 text-white text-4xl cursor-pointer m-2 p-2"
                                            />
                                        </div>
                                    </div>
                    
                    
                                    
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
