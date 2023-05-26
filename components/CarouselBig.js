import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductItem from "./ProductItem";

const CarouselBig = ({ items }) => {
    console.log(items);

    const itemsPerSlide = 5;
    const totalSlides = Math.ceil(items.length / itemsPerSlide);

    return (
        <div className="carouselBig-container">
            <Carousel
                showThumbs={false}
                showStatus={false}
                renderThumbs={() => null}
                showIndicators={false}
                showArrows={true} // Add arrows to navigate horizontally
                className="overflow-x-hidden"
            >
                {[...Array(totalSlides)].map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        className="slideBig grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    >
                        {items
                            .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                            .map((item) => (
                                <div key={item.key} className="mx-auto p-4">
                                    <ProductItem product={item.props.product} />
                                </div>
                            ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CarouselBig;
