import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import endpoints from "@/pages/api/endpoints/endpoints";

export default function PlaceOrderScreen() {
    const { state , dispatch } = useContext(Store);
    const { cart } = state;
    const { cartItems, shippingAddress, paymentMethod } = cart;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

    const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );

    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = 0;
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    const router = useRouter();
    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment');
        }
    }, [paymentMethod, router]);

    const [loading, setLoading] = useState(false);

    const placeOrderHandler = async () => {
        try {
            const newList = cartItems.map(({ id: product, quantity, price }) => ({ product, quantity, price }));

            setLoading(true);
            const response = await axios.post(endpoints.order, {
                orderItems: newList,
                createdAt : new Date(),
                totalPrice,
                status: "CREATED",
                phoneNumber: shippingAddress.phoneNumber,
                customerName: shippingAddress.fullName,
                paymentMethod: paymentMethod,
                shippingAddress: `City: ${shippingAddress.city}, address: ${shippingAddress.address}, postal code: ${shippingAddress.postalCode}`,
                email :shippingAddress.email,
            });
            setLoading(false);
            if(!(response.status === 201)){
                toast.error(getError("Failed to create order"));
            }
            dispatch({ type: 'CART_CLEAR_ITEMS' });
            Cookies.set(
                'cart',
                JSON.stringify({
                    ...cart,
                    cartItems: [],
                })
            );
            router.push(`/order/${response.data}`);
        } catch (err) {
            setLoading(false);
            toast.error(getError(err));
        }
    };

    return (
        <Layout title="Place Order">
            <CheckoutWizard activeStep={2} />
            <h1 className="mb-4 text-xl">Place Order</h1>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link legacyBehavior href="/">Go shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Contacts</h2>
                            <div>
                                Full name: {shippingAddress.fullName},
                                Phone: +{shippingAddress.phoneNumber}, Email: {shippingAddress.email}
                            </div>
                            <div>
                                <Link legacyBehavior href="/shipping">Edit</Link>
                            </div>
                        </div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Shipping Address</h2>
                            <div>
                                {shippingAddress.address},{' '}
                                {shippingAddress.city}, {shippingAddress.postalCode}
                            </div>
                            <div>
                                <Link legacyBehavior href="/shipping">Edit</Link>
                            </div>
                        </div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Payment Method</h2>
                            <div>{paymentMethod}</div>
                            <div>
                                <Link legacyBehavior href="/payment">Edit</Link>
                            </div>
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
                                </tr>
                                </thead>
                                <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item._id} className="border-b">
                                        <td>
                                            <Link legacyBehavior href={`/product/${item.id}`}>
                                                <a className="flex items-center">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    ></Image>
                                                    &nbsp;
                                                    {item.name}
                                                </a>
                                            </Link>
                                        </td>
                                        <td className=" p-5 text-right">{item.quantity}</td>
                                        <td className="p-5 text-right">${item.price}</td>
                                        <td className="p-5 text-right">
                                            {item.quantity * item.price} €
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div>
                                <Link legacyBehavior href="/cart">Edit</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Order Summary</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Items</div>
                                        <div>{itemsPrice} €</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Tax</div>
                                        <div>{taxPrice} €</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Shipping</div>
                                        <div>{shippingPrice} €</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Total</div>
                                        <div>{totalPrice} €</div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        disabled={loading}
                                        onClick={placeOrderHandler}
                                        className="primary-button w-full"
                                    >
                                        {loading ? 'Loading...' : 'Place Order'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}