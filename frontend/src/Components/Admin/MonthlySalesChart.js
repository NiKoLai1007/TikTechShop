import React, { useState, useEffect } from 'react'
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from "../../utils/helpers";
import axios from "axios";
import Loader from '../Layout/Loader';
// import { BarChart } from 'recharts';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlySalesChart() {
    const [sales, setSales] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    const monthlySales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/sales-per-month`, config)
            setSales(data.salesPerMonth)
            setLoading(false)

        } catch (error) {
           setError(error.response.data.message)
        }
    }
    useEffect(() => {
        monthlySales()
       
    }, [])

    return (
        <ResponsiveContainer width="100%" height={300}>
            {loading ? <Loader /> : (
                <BarChart width={600} height={300} data={sales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Bar dataKey="total" fill="#7CB5EC" />
                    <CartesianGrid stroke="#4a5492" strokeDasharray="5 5" />
                    <XAxis dataKey="month" tick={{ fill: '#ffffff' }} />
                    <YAxis tick={{ fill: '#ffffff' }} />
                    <Tooltip contentStyle={{ color: '#ffffff' }} />
                </BarChart>
            )}
        </ResponsiveContainer>
    );
}