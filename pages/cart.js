import {useContext, useEffect} from "react";
import {Store} from "@/utils/Store";
import Layout from "@/components/layout";
import Link from "next/link";
import Image from 'next/image';
import {useRouter} from "next/router";
import {XCircleIcon} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import {getProduct} from "@/utils/data";
import {toast} from "react-toastify";
import {getError} from "@/utils/error";

function CartScreen() {
    const {state, dispatch} = useContext(Store);
    const router = useRouter();
    let {cart: {cartItems}} = state
    let store_items = []
    const removeItemHandler = (item) => {
        dispatch({type: 'CART_REMOVE_ITEM', payload: item});
    };



    const updateCartHandler = (item, input, islast) => {
        if (item.quantity === 0 && islast) {
            removeItemHandler(item);
        } else {
            let qty = input.value;
            let store_item = store_items.find(store_item => store_item.id === item.id);
            if (1 > qty) {
                input.value = 1
                toast.error("Quantity is too");
            }
            else if (store_item.maxQuantity < qty) {
                input.value = store_item.maxQuantity
                toast.error("Max quantity : " + store_item.maxQuantity);
            } else {
                const quantity = Number(qty);
                dispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}});
            }
        }

    };

    function updateCartItems(storeItems, cartItems) {
        const updatedCartItems = cartItems
            .filter((cartItem) => {
                const storeItem = storeItems.find((item) => item.id === cartItem.id);
                return storeItem && storeItem.quantity > 0;
            })
            .map((cartItem) => {
                const storeItem = storeItems.find((item) => item.id === cartItem.id);
                return {...cartItem, maxQuantity: storeItem.quantity};
            });
        store_items = updatedCartItems;
        return updatedCartItems;
    }

    useEffect(() => {
        const promises = cartItems.map((item) => getProduct(item.id));
        Promise.all(promises)
            .then((products) => {
                updateCartItems(products, cartItems)
            })
            .catch((error) => {
                toast.error(getError(error));
            });
    }, [cartItems])

    return (
        <Layout title="Shopping Cart">
            <h1 className="mb-4 text-xl">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Go shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <table className="min-w-full ">
                            <thead className="border-b">
                            <tr>
                                <th className="p-5 text-left">Item</th>
                                <th className="p-5 text-right">Quantity</th>
                                <th className="p-5 text-right">Price</th>
                                <th className="p-5">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id} className="border-b">
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
                                    <td className="p-5 text-right">
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^[1-9][0-9]*$/.test(value) || value === '') {
                                                    updateCartHandler(item, e.target, false);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (/^[1-9][0-9]*$/.test(value) || value === '') {
                                                    updateCartHandler(item, e.target, true);
                                                }
                                            }}
                                        />

                                    </td>
                                    <td className="p-5 text-right">{item.price} €</td>
                                    <td className="p-5 text-center">
                                        <button onClick={() => removeItemHandler(item)}>
                                            <XCircleIcon className="h-5 w-5"></XCircleIcon>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card p-5">
                        <ul>
                            <li>
                                <div className="pb-3 text-xl">
                                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                                </div>
                            </li>
                            <li>
                                <button
                                    onClick={() => router.push('/shipping')}
                                    className="primary-button w-full"
                                >
                                    Check Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(CartScreen), {ssr: false})