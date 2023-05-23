import axios from 'axios';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import endpoints from "@/pages/api/endpoints/endpoints";
import {Statistics} from "@/models/Statistics";
import {getSession} from "next-auth/react";
import {useRouter} from "next/router";


function AdminDashboardScreen() {
    const router = useRouter();

    const request = new Statistics();


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statistics, setStatistics] = useState(request);
    const [interval, setInterval] = useState(1);


    function setDate() {
        request.startDate = new Date();
        request.endDate = new Date()
        const currentDate = new Date();
        if(interval === 1){
            request.startDate.setDate(currentDate.getDate() - 7);
            document.getElementById('week-button').classList.add('selected-button');

        }
        if(interval === 2){
            request.startDate.setDate(currentDate.getDate() - 30);
            document.getElementById('month-button').classList.add('selected-button');

        }
        if(interval === 3){
            request.endDate.setDate(currentDate.getDate() - 60);
            request.startDate.setDate(currentDate.getDate() - 60);
            document.getElementById('last-month-button').classList.add('selected-button');

        }
        if(interval === 4){
            request.startDate.setDate(currentDate.getDate() - 365);
            document.getElementById('year-button').classList.add('selected-button');
        }

    }
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

    const getStatistics = async (startDate, endDate) => {

        const jwtToken = await getToken();

        startDate = startDate.toISOString().split('T')[0];
        endDate = endDate.toISOString().split('T')[0];

        const params = {startDate};

        if (endDate) {
            params.endDate = endDate;
        }

        try {
            const response = await axios.get(endpoints.statistics, {params, headers: jwtToken});
            const statistics = response.data;
            setStatistics(statistics);
        } catch (error) {
            setError('Fetch FAILED');
        }
    };



    useEffect(() => {
        const fetchData = async () => {


            setLoading(true);
            setDate();
            await getStatistics(request.startDate, request.endDate);
            setLoading(false);
        };

        fetchData();
    }, [interval]);


        const changeDate = (number) => {
            console.log("Suveike");
        if(!(number === interval)){
            switch (interval) {
                case 1:
                    if( document.getElementById('week-button').classList.contains('selected-button')){
                        document.getElementById('week-button').classList.remove('selected-button');
                    }
                    break;
                case 2:
                    document.getElementById('month-button').classList.remove('selected-button');
                    break;
                case 3:
                    document.getElementById('last-month-button').classList.remove('selected-button');
                    break;
                case 4:
                    document.getElementById('year-button').classList.remove('selected-button');
                    break;
                default:
                    break;
            }

            setInterval(number);
        }
    }

    return (
        <Layout title="Admin Dashboard">
            <div className="grid  md:grid-cols-4 md:gap-5">
                <div>
                    <ul>
                        <li>
                            <Link href="/admin/dashboard" className="font-bold">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/orders">Orders</Link>
                        </li>
                        <li>
                            <Link href="/admin/products">Products</Link>
                        </li>

                    </ul>
                </div>
                <div className="md:col-span-3">
                    <h1 className="mb-4 text-xl">Admin Dashboard</h1>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div className="grid md:grid-cols-4 md:gap-5">

                            <div className="overflow-x-auto md:col-span-3">


                                <div className="card  p-5">
                                    <h2 className="mb-2 text-lg">Total orders</h2>
                                    <div className="alert-inform">{statistics.orders_count}</div>
                                </div>
                                <div className="card  p-5">
                                    <h2 className="mb-2 text-lg">Total turnover</h2>
                                    <div className="alert-inform">{statistics.total_money} €</div>
                                </div>
                                <div className="card  p-5">
                                    <h2 className="mb-2 text-lg">Orders that are still waiting</h2>
                                    <div className="alert-error">{statistics.orders_waiting}</div>
                                </div>
                                <div className="card  p-5">
                                    <h2 className="mb-2 text-lg">Orders that were executed</h2>
                                    <div className="alert-success">{statistics.orders_delivered}</div>
                                </div>


                            </div>
                            <div className="card  p-5">
                                <h2 className="mb-2 text-lg text-center">Select time interval</h2>
                                <button id="week-button" className="primary-button w-full px-2 py-2 mb-4" onClick={() => changeDate(1)} disabled={loading}>
                                    Week
                                </button>
                                <button id="month-button" className="primary-button w-full px-2 py-2 mb-4" onClick={() => changeDate(2)} disabled={loading}>
                                    Month
                                </button>
                                <button id="last-month-button" className="primary-button w-full px-2 py-2 mb-4" onClick={() => changeDate(3)} disabled={loading}>
                                    Last month
                                </button>
                                <button id="year-button" className="primary-button w-full px-2 py-4" onClick={() => changeDate(4)} disabled={loading}>
                                    Year
                                </button>


                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboardScreen;
