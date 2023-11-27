import React, { useState, useEffect } from 'react'
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     Cell,
// } from "recharts";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getToken } from "../../utils/helpers";
import axios from "axios";
import Loader from '../Layout/Loader';

const UserSalesChart = ({ data }) => {
    const [sales, setSales] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const userSales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/customer-sales`, config)
            setSales(data.customerSales)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const barColors = ["#FFFFFF", "#FFFFFF", "#FFFFFF"]
    useEffect(() => {
        userSales()
        // allUsers()
    }, [])

    return (
        <ResponsiveContainer width="100%" height={300}>
    {loading ? <Loader /> : (
        <LineChart data={sales} >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="userDetails.name" />
            <YAxis tick={{ fill: '#ffffff' }} />
            <Tooltip contentStyle={{ color: '#ffffff' }} />
            <Legend />

            <Line type="monotone" dataKey="total" stroke="#ffffff" strokeWidth={5} />
        </LineChart>
    )}
</ResponsiveContainer>


    );
}
export default UserSalesChart