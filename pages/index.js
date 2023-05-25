import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import {useEffect, useState} from "react";
import {getProducts} from "@/utils/data";
import CarouselComponent from "@/components/CarouselComponent";
import CarouselBig from "@/components/CarouselBig";



export default function Home() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const products= getProducts();
        products.then((result) => {
            setData(result);
        });}, []);

    return (
        <Layout title="Home Page">
            {Array.isArray(data) && data.length > 0 ? (
                <CarouselComponent items={data.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
            ) : (
                <p>Loading products...</p>
            )}
            <h1 className="text-4xl font-bold p-1 ">Gėlės</h1>
            {Array.isArray(data) && data.length > 0 ? (
                <CarouselBig items={data.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
            ) : (
                <p>Loading products...</p>
            )}
            <h1 className="text-4xl font-bold p-1 ">Puokštės</h1>
            {Array.isArray(data) && data.length > 0 ? (
                <CarouselBig items={data.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
            ) : (
                <p>Loading products...</p>
            )}
            <h1 className="text-4xl font-bold p-1 ">Gyvos gėlės</h1>
            {Array.isArray(data) && data.length > 0 ? (
                <CarouselBig items={data.map((product) => (
                    <ProductItem product={product} key={product.id}></ProductItem>
                ))} />
            ) : (
                <p>Loading products...</p>
            )}
        </Layout>
    );
}