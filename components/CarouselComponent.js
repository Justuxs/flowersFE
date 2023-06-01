import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductItem from "./ProductItem";

const CarouselComponent = ({ items }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % items.length; // Calculate the next index
                return nextIndex;
            });
        }, 3000);

        return () => {
            clearInterval(interval); // Clear the interval on component unmount
        };
    }, [items.length]);

    const maxWidth = Math.max(...items.map((item) => item.props.product.width));
    const maxHeight = Math.max(...items.map((item) => item.props.product.height));

    const carouselStyle = {
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
    };

    return (
        <Carousel
            showThumbs={true}
            style={carouselStyle}
            selectedItem={selectedIndex}
            onChange={(index) => setSelectedIndex(index)}
        >
            {items.map((item) => (
                <div key={item.key}>
                    <ProductItem product={item.props.product} />
                </div>
            ))}
        </Carousel>
    );
};

export default CarouselComponent;
