import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';

export default function Layout({ title, children }) {
    const { status, data: session } = useSession();

    const { state } = useContext(Store);
    const { cart } = state;
    const [cartItemsCount, setCartItemsCount] = useState(0);
    useEffect(() => {
        setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
    }, [cart.cartItems]);

    const logoutClickHandler = () => {
        signOut({ callbackUrl: '/#' });
    };

    function DashbordClickHandler() {
        window.location.href = "/admin/dashboard";
    }

    return (
        <>
            <Head>
                <title>{title ? title + ' - Flowers' : 'Flower shop'}</title>
                <meta name="description" content="Flower shop website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer position="bottom-center" limit={1} />

            <div
                className="bg-cover bg-center bg-no-repeat bg-image"
                style={{
                    backgroundImage:
                        "url('https://149359637.v2.pressablecdn.com/wp-content/uploads/2021/07/Origami-Flower-Wallpaper-About-Murals.jpg')"
                }}
            >

                <div className="flex min-h-screen flex-col justify-between">
                    <header className="bg-white">
                        <nav className="flex h-12 items-center px-4 justify-between shadow-md ">
                            <Link legacyBehavior  href="/">
                                <a className="text-lg font-bold">Flowers</a>
                            </Link>
                            <h1 className="text-3xl font-bold p-1 font-script text-center p-5 text-black relative z-10">
                                Every flower is a soul blossoming in nature.
                            </h1>
                            <div>
                                <Link legacyBehavior href="/cart">
                                    <a className="p-2">
                                        Cart
                                        {cartItemsCount > 0 && (
                                            <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                        {cartItemsCount}
                      </span>
                                        )}
                                    </a>
                                </Link>

                                {status === 'loading' ? (
                                    'Loading'
                                ) : session?.user ? (
                                    <Menu as="div" className="relative inline-block z-50">
                                        <Menu.Button className="text-blue-600">ADMIN</Menu.Button>
                                        <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
                                            <Menu.Item>
                                                <a
                                                    className="dropdown-link"
                                                    onClick={DashbordClickHandler}
                                                >
                                                    Admin Dashboard
                                                </a>
                                            </Menu.Item>

                                            <Menu.Item>
                                                <a
                                                    className="dropdown-link"
                                                    href="#"
                                                    onClick={logoutClickHandler}
                                                >
                                                    Logout
                                                </a>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Menu>
                                ) : (
                                    <Link legacyBehavior href="/login" className="p-2">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </header>
                    <main className="container m-auto mt-4 px-4">{children}</main>
                    <footer className="flex h-10 justify-center items-center shadow-inner bg-white">
                        <p>Copyright © 2023 Flower shop</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
