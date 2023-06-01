import axios from 'axios';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useReducer} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import Layout from '../../../components/Layout';
import {getError} from '../../../utils/error';
import endpoints from "@/pages/api/endpoints/endpoints";
import {getSession} from "next-auth/react";

function reducer(state, action) {

    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, error: ''};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};

        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true, errorUpdate: ''};
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false, errorUpdate: ''};
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false, errorUpdate: action.payload};

        case 'UPLOAD_REQUEST':
            return {...state, loadingUpload: true, errorUpload: ''};
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return {...state, loadingUpload: false, errorUpload: action.payload};

        default:
            return state;
    }
}

export default function AdminProductCreateScreen() {

    const [{loading, error, loadingUpdate, loadingUpload}, dispatch] =
        useReducer(reducer, {
            loading: false,
            error: '',
        });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();


    const router = useRouter();

    const uploadHandler = async (e) => {

    };

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

    const submitHandler = async ({
                                     name,
                                     id,
                                     price,
                                     category,
                                     image, quantity,
                                     description,
                                 }) => {
        dispatch({type: 'UPDATE_REQUEST'});
        const token = await getToken();

        try {
            await axios.post(`${endpoints.products}`, {
                name,
                id,
                price,
                category,
                image,
                quantity,
                description,
            }, {
                headers: token
            });


            dispatch({type: 'UPDATE_SUCCESS'});
            toast.success('Product updated successfully');
            router.push('/admin/products');
        } catch (err) {
            dispatch({type: 'UPDATE_FAIL', payload: getError(err)});
            toast.error(getError(err));
        }
    };

    return (
        <Layout title={"Create Product"}>
            <div className="grid md:grid-cols-4 md:gap-5">
                <div>
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
                <div className="md:col-span-3">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <form
                            className="mx-auto max-w-screen-md"
                            onSubmit={handleSubmit(submitHandler)}
                        >
                            <h1 className="mb-4 text-xl">{`Create Product`}</h1>
                            <div className="mb-4">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="name"
                                    autoFocus
                                    {...register('name', {
                                        required: 'Please enter name',
                                    })}
                                />
                                {errors.name && (
                                    <div className="text-red-500">{errors.name.message}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    className="w-full"
                                    id="price"
                                    step="0.01"
                                    min="0"
                                    {...register('price', {
                                        required: 'Please enter price',
                                    })}
                                />
                                {errors.price && (
                                    <div className="text-red-500">{errors.price.message}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="image">Image</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="image"
                                    {...register('image', {
                                        required: 'Please enter image',
                                    })}
                                />
                                {errors.image && (
                                    <div className="text-red-500">{errors.image.message}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imageFile">Upload image</label>
                                <input
                                    type="file"
                                    className="w-full"
                                    id="imageFile"
                                    onChange={uploadHandler}
                                />

                                {loadingUpload && <div>Uploading....</div>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="category"
                                    {...register('category', {
                                        required: 'Please enter category',
                                    })}
                                />
                                {errors.category && (
                                    <div className="text-red-500">{errors.category.message}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full"
                                    id="quantity"
                                    {...register('quantity', {
                                        required: 'Please enter quantity',
                                    })}
                                    min={0}
                                />
                                {errors.quantity && (
                                    <div className="text-red-500">
                                        {errors.quantity.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="quantity">Description</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="description"
                                    {...register('description', {
                                        required: 'Please enter description',
                                    })}
                                />
                                {errors.description && (
                                    <div className="text-red-500">
                                        {errors.description.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <button disabled={loadingUpdate} className="primary-button">
                                    {loadingUpdate ? 'Loading' : 'Create'}
                                </button>
                            </div>
                            <div className="mb-4">
                                <Link href={`/admin/products`}>Back</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}

