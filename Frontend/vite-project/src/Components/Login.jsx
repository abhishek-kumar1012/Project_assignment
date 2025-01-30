import carImage2 from './carImage2.jpg'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
        const [email, setEmail]=useState("");
        const [password, setPassword]=useState("");
        const [button,setButton]=useState("Sign In");
    
        const navigate=useNavigate();

        const handleSubmit = async (e) =>{
            e.preventDefault();
        
            try{
            setButton("Signing in...");
            if(password.length<8){
                alert('Password length should be minimum 8');
                setButton("Sign In");
                return;
              }
            const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,{
                email,
                password
            });
    
            if(response.status==200){
                const token=response.data.token;
                localStorage.setItem('token',token);
                navigate('/dashboard');
            }
        }catch(e){
            console.log(e);
            setButton("Sign In");
            if(e.response.data.message){
                alert(e.response.data.message);
                return;
            }
            alert('Error while Signing in');
        }
        }
    
        return (
            <div className="bg-black h-fit   flex justify-center items-center">
                <div className=" md:flex md:border md:border-black rounded-md md:bg-black pt-10 ">
                <div className='image px-2 mt-10 md:mt-14   '>
                      <img className="rounded-lg p-2 md:h-4/5 " src={carImage2}/>
                </div>
                    <div className='form md:w-1/2'>
                    <h1 className="text-white font-semibold text-2xl md:text-3xl text-center mt-10 md:mt-16">Sign In</h1>
                        <div className="flex justify-center items-center  mt-5 mb-10 md:mb-5">
                          <p className='font-semibold text-white'>New User?</p>
                          <a className='ml-2 text-white cursor-pointer'><u onClick={()=>{
                            navigate('/');
                            }}>Create an account</u></a>
                        </div>
                        <div className='flex justify-center '>
                          <form onSubmit={handleSubmit} className='pb-5'>
                            <input type="email" className='my-4 p-3  rounded-md' placeholder="Email" onChange={(e)=>setEmail(e.target.value)}  required/><br/>
                            <input type="password" className='my-4 p-3 w-full rounded-md' placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)} required/><br/>
                            <button className='bg-purple-600 px-14 w-full py-3 rounded-md my-2 cursor-hover text-white' type="submit">{button}</button>
                            <div className='text-white border border-white rounded-md p-2 mt-2'>
                                <h1 className='font-semibold'>Test Details</h1>
                                <h2>email: abc@gmail.com</h2>
                                <h2>password: 12345678</h2>
                            </div>
                          </form>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
 