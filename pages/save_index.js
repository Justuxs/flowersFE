import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import {useEffect, useState} from "react";
import {getProducts} from "@/utils/data";



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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {data.map((product) => (
                        <ProductItem product={product} key={product.id}></ProductItem>
                    ))}
                </div>
            ) : (
                <p>Loading products...</p>
            )}
        </Layout>
    );
}