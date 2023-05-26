import Link from "next/link";


export default function ProductItem({product}) {




    return (
        <div className="card bg-white">
            <Link legacyBehavior href={`/product/${product.id}`}>
                <a>
                    <img className="rounded shadow product-image" src={product.image} alt={product.name}/>
                </a>
            </Link>

            <div className="flex flex-col items-center justify-center p-5">
                <Link legacyBehavior href={`/product/${product.id}`}>
                    <>
                        <a>
                            <h2 className="text-lg">{product.name}</h2>
                        </a>
                        <p>{product.price} €</p>
                        <button className="primary-button" type="button" >
                            <a  href={`/product/${product.id}`}> Info</a>
                        </button>
                    </>
                </Link>
            </div>
        </div>
    )
}