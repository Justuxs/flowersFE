import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useReducer, useState} from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import endpoints from '@/pages/api/endpoints/endpoints';
import AlertDialogSlide from "@/components/AlertDialogSlide";

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderScreen({ id }) {
  const { data: session } = useSession();
  const [reviewable ,setReviewable] = useState(false);
  const [
    { loading, error, order, loadingDeliver },
    dispatch
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: ''
  });

  const fetchOrder = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`${endpoints.order}/${id}`);
      console.log(data)
      if(data.status.toLowerCase() ==="delivered") setReviewable(true);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  function changeStatusHandler(status) {
    const fetchOrderStatus = async () => {
      try {
        await axios.post(`${endpoints.order}/${id}`, {
          id: id,
          status: status
        });
        await fetchOrder();
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrderStatus();
  }

    return (
        <Layout title={`Order ${id}`}>
            <h1 className="mb-4 text-xl">{`Order ${id}`}</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="alert-error">{error}</div>
            ) : (


                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">

                        <div className="card p-5">
                            <h2 className="mb-2 text-lg">Status</h2>
                          {order.status.toLowerCase() ==="canceled" ?  <div className="alert-error">{order.status}</div> :
                          order.status.toLowerCase() ==="delivered" ?  <div className="alert-success">{order.status}</div>:
                          <div className="alert-inform">{order.status}</div>}

                        </div>

                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Shipping Address</h2>
                            <div className="alert-success">{order.shippingAddress}</div>
                        </div>


                        <div className="card p-5">
                            <h2 className="mb-2 text-lg">Payment Method</h2>
                            <div>{order.paymentMethod}</div>
                            <div className="alert-error">Not paid</div>
                        </div>

                        <div className="card overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg">Order Items</h2>
                            <table className="min-w-full">
                                <thead className="border-b">
                                <tr>
                                    <th className="px-5 text-left">Item</th>
                                    <th className="    p-5 text-right">Quantity</th>
                                    <th className="  p-5 text-right">Price</th>
                                    <th className="p-5 text-right">Subtotal</th>
                                  {reviewable && <th className="p-5 ">Review</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {order.orderItems.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td>
                                            <Link
                                                href={`/product/${item.product.id}`}
                                                className="flex items-center"
                                            >
                                                <Image
                                                    src={item.product.image == null ? "/images/roze.jpg" : item.product.image}
                                                    alt={item.product.image == null ? "/images/roze.jpg" : item.product.image}
                                                    width={50}
                                                    height={50}
                                                    style={{
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                    }}
                                                ></Image>
                                                {item.product.name}
                                            </Link>
                                        </td>
                                        <td className=" p-5 text-right">{item.quantity}</td>
                                        <td className="p-5 text-right">${item.price}</td>
                                        <td className="p-5 text-right">
                                            ${item.quantity * item.price}
                                        </td>
                                      {reviewable && <td className="p-5 text-right">
                                        <AlertDialogSlide
                                            orderID = {item.id}
                                            productID = {item.product.id}
                                            reviewer={order.customerName}
                                            isActive = {item.review ==null}
                                        >
                                        </AlertDialogSlide>
                                      </td>}

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Order Summary</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Items</div>
                                        <div>{order.orderItems.reduce((total, item) => total + item.quantity, 0)}</div>
                                    </div>
                                </li>
                                {' '}

                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Total</div>
                                        <div>${order.totalPrice}</div>
                                    </div>
                                </li>

                                {session?.user && order.status.toLowerCase() ==="created" &&(
                                    <li>
                                        {loadingDeliver && <div>Loading...</div>}
                                        <button
                                            className="primary-button w-full"
                                            onClick={() => changeStatusHandler("DELIVERED")}
                                        >
                                            DELIVER
                                        </button>
                                      <button
                                          className="red-primary-button w-full"
                                          onClick={() => changeStatusHandler("CANCELED")}
                                      >
                                        CANCEL
                                      </button>

                                    </li>
                                )}

                            </ul>
                        </div>
                    </div>

                </div>
            )}
        </Layout>
    );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  return {
    props: {
      id
    }
  };
}