import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductItem from "./ProductItem";

const CarouselComponent = ({ items }) => {
    console.log(items);

    // Get the maximum width and height among all items
    const maxWidth = Math.max(...items.map((item) => item.props.product.width));
    const maxHeight = Math.max(...items.map((item) => item.props.product.height));

    // Set the carousel dimensions to match the maximum width and height
    const carouselStyle = {
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
    };

    return (
        <Carousel showThumbs={false} style={carouselStyle}>
            {items.map((item) => (
                <div key={item.key}>
                    {console.log(item.props.product)}
                    <ProductItem product={item.props.product} />
                </div>
            ))}
        </Carousel>
    );
};

export default CarouselComponent;
