import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function EditForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [button, setButton] = useState("Update Car");
  const {id}=useParams();

  useEffect(()=>{
    async function fetchData(){
        const response=axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/products/listProduct/${id}`);
        const data=(await response).data.car;
        setDescription(data.description);
        setPrice(data.price);
        setTitle(data.title);
        setTags(data.tags);
        setImages(data.images);
    }

    fetchData();
  },[id]);


  const navigate = useNavigate();

  const uploadFiles = async () => {
    const uploadedImageUrls = [];
    const cloudName = "dv3vxqkwd";
    const api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    for (let i = 0; i < images.length; i++) {
      const data = new FormData();
      data.append("file", images[i]);
      data.append("upload_preset", 'images_preset');

      try {
        const res = await axios.post(api, data);
        const { secure_url } = res.data;
        uploadedImageUrls.push(secure_url);
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
    return uploadedImageUrls;
  };

  const saveCar = async (e) => {
    setButton("Updating...");
    e.preventDefault();
    const imageUrls = await uploadFiles();
    console.log(imageUrls);
    const token=localStorage.getItem('token');

    try {
      console.log('inside try');
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/updateProduct/${id}`,
        {
          title,
          description,
          images: imageUrls, // Use the array of image URLs
          tags,
          price
        },
        {
          headers:{
            token,
          }
        }
      );
      const carId = res.data._id;
      alert("Car Updated Successfully");
      navigate('/dashboard');
    } catch (error) {
      setButton("Update Car");
      if(error.response.data.message=="Token is required"){
        alert("You don't have access to edit the product");
        return;
      }
      console.error("Error while updating car:", error);
      alert("Error while updating car");
    }
  };

  return (
    <div className="flex flex-col items-center bg-black h-screen">
      <h1 className="text-3xl font-semibold mb-5 mt-2 text-white">Update Car Details</h1>
      <form
        onSubmit={saveCar}
        className="bg-white border border-gray-300 rounded-lg p-4 w-5/6 md:w-1/3 md:p-2 "
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            value={title}
            id="title"
            type="text"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
          value={description}
            id="description"
            type="text"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price
          </label>
          <input
          value={price}
            id="price"
            type="number"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter price"
            required
          />
        </div>
        {/* File Upload Field */}
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Car Images
          </label>
          <input
        //   value={imageUrls}
        //   value={images}
            id="file-upload"
            name="file"
            type="file"
            multiple
            accept=".jpeg,.png,.jpg"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setImages(Array.from(e.target.files))}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags (comma-separated)
          </label>
          <input
          value={tags}
            id="tags"
            name="tags"
            type="text"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setTags(e.target.value.split(","))}
            placeholder="Enter tags, separated by commas"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
          >
            {button}
          </button>
        </div>
      </form>
    </div>
  );
}
