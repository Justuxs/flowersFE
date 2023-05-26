import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import {useEffect, useState} from "react";
import {getProducts} from "@/utils/data";
import CarouselComponent from "@/components/CarouselComponent";
import CarouselBig from "@/components/CarouselBig";
import axios from "axios";



export default function Home() {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);


    const getProducts = async (categoryId) => {
        try {
            const response = await axios.get(`http://localhost:8080/products?categoryId=${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const fetchData = async () => {
        const categoryId1 = 0;
        const categoryId2 = 1;
        const categoryId3 = 2;

        const product1 = await getProducts(categoryId1);
        const product2 = await getProducts(categoryId2);
        const product3 = await getProducts(categoryId3);
        setData1(product1);
        setData2(product2);
        setData3(product3);

    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout title="Home Page">


            {Array.isArray(data1) && data1.length > 0 ? (
                <CarouselComponent items={data1.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
            ) : (
                <p>Loading products...</p>
            )}
            {Array.isArray(data1) && data1.length > 0 ? (
                <div>
                    <h1 className="text-7xl font-bold p-1 font-script text-center p-6">Gėlės</h1>
                    <CarouselBig items={data1.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
                </div>
            ) : (
                <p>Loading products...</p>
            )}
            {Array.isArray(data2) && data2.length > 0 ? (
                <div>
                    <h1 className="text-7xl font-bold p-1 font-script text-center p-6">Gyvos geles</h1>
                    <CarouselBig items={data2.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
                </div>
            ) : (
                <p>Loading products...</p>
            )}
            {Array.isArray(data3) && data3.length > 0 ? (

                <div>
                    <h1 className="text-7xl font-bold p-1 font-script text-center p-6">Puokštės</h1>

                    <CarouselBig items={data3.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
                </div>
            ) : (
                <p>Loading products...</p>
            )}
        </Layout>
    );
}