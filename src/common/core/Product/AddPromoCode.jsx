import React, { useEffect, useState } from 'react';  
import { addCoupon, getAllCoupon,action } from '../../../services/operations/couponAPI';  
import { useSelector } from "react-redux";
const AddPromoCode = () => {  
    const adminToken = useSelector((state) => state.admin.adminToken);
    const [code, setCode] = useState('');  
    const [discountPercentage, setDiscountPercentage] = useState('');  
    const [condition, setCondition] = useState('');  
    const [description, setDescription] = useState('');  
    const [coupons, setCoupons] = useState([]);  
    // console.log("admin token",adminToken)
    const handleSubmit = async (e) => {  
        e.preventDefault();  
        const newCoupon = { code, discountPercentage: Number(discountPercentage), condition: Number(condition), description, status: 'active' };  

        try {  
            await addCoupon(newCoupon,adminToken);  
            setCoupons([...coupons, newCoupon]); 
            setCode(''); setDiscountPercentage(''); setCondition(''); setDescription('');  
        } catch (error) {  
            console.error('Error adding coupon:', error);  
        }  
    };  

    useEffect(() => {  
        const fetchCoupons = async () => {  
            try {  
                const response = await getAllCoupon();  
                setCoupons(response.data.data || []);  
            } catch (error) {  
                console.error("Error fetching coupons:", error);  
            }  
        };  
        fetchCoupons();  
    }, []);  

    const toggleStatus =async (id) => {
        try{
            console.log("id f",id);
            const r=await action(id,{adminToken});
            const updatedCoupons = coupons.map(coupon => {
                if(coupon._id === id) {
                    coupon.status = coupon.status === 'active' ? 'inactive' : 'active';
                }
                return coupon;
            });
            setCoupons(updatedCoupons);
            console.log("response",r);
        }
        catch(error){
            console.error("Error toggling status:", error);
        }   
    };

    return (  
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">  
            {/* Form Section */}  
            <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-md">  
                <h2 className="text-2xl font-bold mb-6 text-center">Add Promo Code</h2>  
                <form onSubmit={handleSubmit} className="space-y-4">  
                    <div>
                        <label className="block text-gray-700">Code:</label>  
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>  
                    </div>
                    <div>
                        <label className="block text-gray-700">Discount Percentage:</label>  
                        <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>  
                    </div>
                    <div>
                        <label className="block text-gray-700">Condition:</label>  
                        <input type="number" value={condition} onChange={(e) => setCondition(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>  
                    </div>
                    <div>
                        <label className="block text-gray-700">Description:</label>  
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>  
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Add Promo Code</button>  
                </form>  
            </div>  
            
            {/* Coupons Table Section */}  
            <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-md">  
                <h2 className="text-2xl font-bold mb-6 text-center">Promo Codes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border">Code</th>
                                <th className="py-2 px-4 border">Discount</th>
                                <th className="py-2 px-4 border">Condition</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(coupon => (
                                <tr key={coupon._id} className="text-center">
                                    <td className="border px-4 py-2">{coupon.code}</td>
                                    <td className="border px-4 py-2">{coupon.discountPercentage}%</td>
                                    <td className="border px-4 py-2">₹{coupon.condition}</td>
                                    <td className={`border px-4 py-2 ${coupon.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{coupon.status}</td>
                                    <td className="border px-4 py-2">
                                        <button 
                                            onClick={() => toggleStatus(coupon._id)} 
                                            className={`px-4 py-1 rounded ${coupon.status === 'active' ? 'bg-red-500' : 'bg-green-500'} text-white`}
                                        >
                                            {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>  
        </div>  
    );  
};  

export default AddPromoCode;
