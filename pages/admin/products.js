import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {useEffect, useReducer} from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '@/utils/error';
import {getProducts} from "@/utils/data";
import endpoints from "@/pages/api/endpoints/endpoints";
import {getSession} from "next-auth/react";

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      state;
  }
}
export default function AdminProdcutsScreen() {
  const router = useRouter();


  const [
    { loading, error, products, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });
  async function getToken() {
    const session = await getSession();
    const jwtToken = session?.jwtToken.email;
    if (jwtToken === undefined) {
      router.replace("/login");
      return;
    }
    const token = {'Authorization': `Bearer ${jwtToken}`}
    return token;
  }
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        getProducts(token).then((data) => {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } )

      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }

  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      const token = await getToken();
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`${endpoints.products}/${productId}`,   {headers: token});
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Product deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Admin Products">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div >
          <ul className="card p-4">
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products" className="font-bold">
                Products
              </Link>
            </li>

          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Products</h1>
            {loadingDelete && <div>Deleting item...</div>}
            <Link
                href={`/admin/product/create`}
                type="button"
                className="primary-button"
            >
              Create
            </Link>
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
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">PRICE</th>
                    <th className="p-5 text-left">CATEGORY</th>
                    <th className="p-5 text-left">COUNT</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className=" p-5 ">{product.id}</td>
                      <td className=" p-5 ">{product.name}</td>
                      <td className=" p-5 ">{product.price}€</td>
                      <td className=" p-5 ">{product.category}</td>
                      <td className=" p-5 ">{product.quantity}</td>
                      <td className=" p-5 ">
                        <Link
                          href={`/admin/product/${product.id}`}
                          type="button"
                          className="default-button"
                        >
                          Edit
                        </Link>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(product.id)}
                          className="default-button"
                          type="button"
                        >
                          Delete
                        </button>
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

