import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

export default function ShippingScreen() {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
    } = useForm();

    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { shippingAddress } = cart;
    const router = useRouter();

    useEffect(() => {
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('phoneNumber', shippingAddress.phoneNumber);
        setValue('email', shippingAddress.email);

    }, [setValue, shippingAddress]);

    const submitHandler = ({ fullName, address, city, postalCode, phoneNumber,email }) => {
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { fullName, address, city, postalCode, phoneNumber,email },
        });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    postalCode,
                    phoneNumber,
                    email
                },
            })
        );

        router.push('/payment');
    };

    return (
        <Layout title="Shipping Address">
            <CheckoutWizard activeStep={0} />
            <form
                className="mx-auto max-w-screen-md"
                onSubmit={handleSubmit(submitHandler)}
            >
                <h1 className="mb-4 text-xl">Shipping Address</h1>
                <div className="mb-4">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        className="w-full"
                        id="fullName"
                        autoFocus
                        {...register('fullName', {
                            required: 'Please enter full name',
                        })}
                    />
                    {errors.fullName && (
                        <div className="text-red-500">{errors.fullName.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="address">Address</label>
                    <input
                        className="w-full"
                        id="address"
                        {...register('address', {
                            required: 'Please enter address',
                            minLength: { value: 3, message: 'Address is more than 2 chars' },
                        })}
                    />
                    {errors.address && (
                        <div className="text-red-500">{errors.address.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="city">City</label>
                    <input
                        className="w-full"
                        id="city"
                        {...register('city', {
                            required: 'Please enter city',
                        })}
                    />
                    {errors.city && (
                        <div className="text-red-500 ">{errors.city.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                        className="w-full"
                        id="postalCode"
                        {...register('postalCode', {
                            required: 'Please enter postal code',
                        })}
                    />
                    {errors.postalCode && (
                        <div className="text-red-500 ">{errors.postalCode.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="phoneNumber">Phone number</label>
                    <input
                        className="w-full"
                        id="phoneNumber"
                        {...register('phoneNumber', {
                            required: 'Please enter phone number',
                            pattern: {
                                value: /^\+?[0-9]{10}$/i, // regex for 10-digit phone number
                                message: 'Please enter a valid phone number like +3701234567',
                            },
                        })}
                    />
                    {errors.phoneNumber && (
                        <div className="text-red-500 ">{errors.phoneNumber.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="email">Email address</label>
                    <input
                        className="w-full"
                        id="email"
                        {...register('email', {
                            required: 'Please email address',
                            pattern: {
                                value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
                                message: 'Please enter a valid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <div className="text-red-500 ">{errors.email.message}</div>
                    )}
                </div>
                <div className="mb-4 flex justify-between">
                    <button className="primary-button">Next</button>
                </div>
            </form>
        </Layout>
    );
}

