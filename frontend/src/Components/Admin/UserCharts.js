import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import Loader from '../Layout/Loader';

const UserCharts = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const listUsers = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(`http://localhost:4001/api/v1/admin/users`, config);
      setAllUsers(data.users);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart data={allUsers}>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey="createdAt" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Scatter type="linear" dataKey="createdAt" fill="#8884d8" line={{ stroke: '#8884d8', strokeWidth: 2 }} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default UserCharts;