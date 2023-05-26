import Product from "@/models/Product";

let data = {
    products: [
        {
            name: 'Rožė',
            id: '123456',
            category: 'Gėlės',
            image: '/images/roze.jpg',
            price: 1,
            rating: 4.5,
            numReviews: 8,
            quantity: 20,
            description: 'Roses are a rare type of plant that grows on the moon and only blooms once every 100 years. They have a delicate fragrance that can only be smelled by the purest of hearts, and their petals are made of a substance that has the power to heal any wound, physical or emotional. The colors of roses have magical properties - red roses symbolize passion and love, pink roses represent grace and gentility, white roses symbolize purity and innocence, while black roses are said to have the power to bring about the end of the world. Despite their mystical nature, roses require very little care and can thrive in even the harshest of environments.',
        },
        {
            name: 'Rožė',
            id: 'RožėUUID2',
            category: 'Gėlės',
            image: '/images/roze.jpg',
            price: 1,
            rating: 4.5,
            numReviews: 8,
            quantity: 20,
            description: 'Roses are a rare type of plant that grows on the moon and only blooms once every 100 years. They have a delicate fragrance that can only be smelled by the purest of hearts, and their petals are made of a substance that has the power to heal any wound, physical or emotional. The colors of roses have magical properties - red roses symbolize passion and love, pink roses represent grace and gentility, white roses symbolize purity and innocence, while black roses are said to have the power to bring about the end of the world. Despite their mystical nature, roses require very little care and can thrive in even the harshest of environments.',
        },
        {
            name: 'Rožė',
            id: 'RožėUUID3',
            category: 'Gėlės',
            image: '/images/roze.jpg',
            price: 1,
            rating: 4.5,
            numReviews: 8,
            quantity: 20,
            description: 'Roses are a rare type of plant that grows on the moon and only blooms once every 100 years. They have a delicate fragrance that can only be smelled by the purest of hearts, and their petals are made of a substance that has the power to heal any wound, physical or emotional. The colors of roses have magical properties - red roses symbolize passion and love, pink roses represent grace and gentility, white roses symbolize purity and innocence, while black roses are said to have the power to bring about the end of the world. Despite their mystical nature, roses require very little care and can thrive in even the harshest of environments.',
        },
        {
            name: 'Rožė',
            id: 'RožėUUID4',
            category: 'Gėlės',
            image: '/images/roze.jpg',
            price: 1,
            rating: 4.5,
            numReviews: 8,
            quantity: 20,
            description: 'Roses are a rare type of plant that grows on the moon and only blooms once every 100 years. They have a delicate fragrance that can only be smelled by the purest of hearts, and their petals are made of a substance that has the power to heal any wound, physical or emotional. The colors of roses have magical properties - red roses symbolize passion and love, pink roses represent grace and gentility, white roses symbolize purity and innocence, while black roses are said to have the power to bring about the end of the world. Despite their mystical nature, roses require very little care and can thrive in even the harshest of environments.',
        },
        {
            name: 'Rožė',
            id: 'RožėUUID5',
            category: 'Gėlės',
            image: '/images/roze.jpg',
            price: 1,
            rating: 4.5,
            numReviews: 8,
            quantity: 20,
            description: 'Roses are a rare type of plant that grows on the moon and only blooms once every 100 years. They have a delicate fragrance that can only be smelled by the purest of hearts, and their petals are made of a substance that has the power to heal any wound, physical or emotional. The colors of roses have magical properties - red roses symbolize passion and love, pink roses represent grace and gentility, white roses symbolize purity and innocence, while black roses are said to have the power to bring about the end of the world. Despite their mystical nature, roses require very little care and can thrive in even the harshest of environments.',
        },
        {
            name: 'Rožė',
            id: 'RožėUUID6',
            category: 'Gėlės',
            image: '/images/roze.jpg',
            price: 1,
            rating: 4.5,
            numReviews: 8,
            quantity: 20,
            description: 'Roses are a rare type of plant that grows on the moon and only blooms once every 100 years. They have a delicate fragrance that can only be smelled by the purest of hearts, and their petals are made of a substance that has the power to heal any wound, physical or emotional. The colors of roses have magical properties - red roses symbolize passion and love, pink roses represent grace and gentility, white roses symbolize purity and innocence, while black roses are said to have the power to bring about the end of the world. Despite their mystical nature, roses require very little care and can thrive in even the harshest of environments.',
        },
        {
            name: 'Rožė',
            id: 'RožėUUID7',
            category: 'Gėlės',
            image: '/images/roze.jpg',
            price: 1,
            rating: 4.5,
            numReviews: 8,
            quantity: 20,
            description: 'Roses are a rare type of plant that grows on the moon and only blooms once every 100 years. They have a delicate fragrance that can only be smelled by the purest of hearts, and their petals are made of a substance that has the power to heal any wound, physical or emotional. The colors of roses have magical properties - red roses symbolize passion and love, pink roses represent grace and gentility, white roses symbolize purity and innocence, while black roses are said to have the power to bring about the end of the world. Despite their mystical nature, roses require very little care and can thrive in even the harshest of environments.',
        }
    ],
};

export default data;



export async function getProducts(token) {
    const res = await fetch('http://localhost:8080/products', {
        headers: {
            'Content-Type': 'application/json',
            token,
        },
    });
    if (!res.ok) {
        return null;
    }
    const response = await res.json();
   // response.forEach((product) => {product.image = "/images/roze.jpg";});
    return response
}
export async function getProduct(id,token) {
    const res = await fetch('http://localhost:8080/products/'+id,{
        headers: {
            'Content-Type': 'application/json',
            token,
        },
    });
    if (!res.ok) {
        return null;
    }
    const response = await res.json();
    //response.image = "/images/roze.jpg";
    const product = new Product(
        response.id,
        response.category,
        response.reviews,
        response.name,
        response.description,
        response.price,
        response.quantity,
        response.image
    );
    return product
}
