import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer, useState } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import endpoints from "@/pages/api/endpoints/endpoints";
import { getSession } from "next-auth/react";
import { router } from "next/client";

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  const [filterStatus, setFilterStatus] = useState('');

  async function getToken() {
    const session = await getSession();
    const jwtToken = session?.jwtToken.email;
    if (jwtToken === undefined) {
      router.replace("/login");
      return;
    }
    const token = { 'Authorization': `Bearer ${jwtToken}` };
    return token;
  }

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = await getToken();

      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(endpoints.order, { headers: jwtToken });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredOrders = filterStatus
      ? orders.filter((order) => order.status === filterStatus)
      : orders;

  return (
      <Layout title="Admin Dashboard">
        <div className="grid md:grid-cols-4 md:gap-5">
          <div>
            <ul className="card p-4">
              <li>
                <Link href="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/admin/orders" className="font-bold">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/admin/products">Products</Link>
              </li>
            </ul>
          </div>
          <div className="overflow-x-auto md:col-span-3">
            <h1 className="mb-4 text-xl">Admin Orders</h1>
            <div className="mb-4">
              <label htmlFor="filterStatus" className="mr-2">
                Filter by Status:
              </label>
              <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="CREATED">Created</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="alert-error">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">ID</th>
                      <th className="p-5 text-left">USER</th>
                      <th className="p-5 text-left">DATE</th>
                      <th className="p-5 text-left">TOTAL</th>
                      <th className="p-5 text-left">PAID</th>
                      <th className="p-5 text-left">DELIVERED</th>
                      <th className="p-5 text-left">ACTION</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-5">{order.id.substring(20, 24)}</td>
                          <td className="p-5">{order.customerName}</td>
                          <td className="p-5">{order.createdAt}</td>
                          <td className="p-5">{order.totalPrice}€</td>
                          <td className="p-5">{order.paymentMethod}</td>
                          <td className="p-5">{order.status}</td>
                          <td className="p-5">
                            <Link href={`/order/${order.id}`} passHref>
                              Details
                            </Link>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </div>
      </Layout>
  );
}

