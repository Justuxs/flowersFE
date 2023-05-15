import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import {getProduct} from '../../utils/data';
import {Store} from "@/utils/Store";

export default function ProductScreen({page}) {

    const {state, dispatch} = useContext(Store);
    const router = useRouter();
    const { query } = useRouter();
    const { id } = query;
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const products= getProduct(id);
        products.then((result) => {
            setProduct(result);
        });}, []);


    function addToCartHandler() {
        const existItem = state.cart.cartItems.find((x) => x.id === product.id);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        if (product.quantity < quantity) {
            alert('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: {...product,quantity}})
        router.push('/cart');
    }

    return (
        <Layout title={"Product info"}>
            <div className="py-2">
                <Link href="/">back to products</Link>
            </div>
            {
                (product == null || product.id== undefined)?
                <div className="card p-5">
                    <div className="alert-error">Product not found</div>
                </div> :

            <div className="grid md:grid-cols-4 md:gap-3">
                <div className="md:col-span-2">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout="responsive"
                    ></Image>
                </div>
                <div>
                    <ul>
                        <li>
                            <h1 className="text-lg">{product.name}</h1>
                        </li>
                        <li>Category: {product.category}</li>
                        <li>
                            {product.rating} of  reviews
                        </li>
                        <li>Quantity: {product.quantity}</li>

                        <li>Description: {product.description}</li>
                    </ul>
                </div>
                <div>
                    <div className="card p-5">
                        <div className="mb-2 flex justify-between">
                            <div>Price</div>
                            <div>{product.price} €</div>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <div>Status</div>
                            <div>{product.quantity > 0 ? 'In stock' : 'Unavailable'}</div>
                        </div>
                        <button className="primary-button w-full" onClick={addToCartHandler}>Add to cart</button>
                    </div>
                </div>
            </div>}
        </Layout>
    );
}
export async function getServerSideProps(context) {
    const page = context?.query;
    return { props: { page: page } };
}