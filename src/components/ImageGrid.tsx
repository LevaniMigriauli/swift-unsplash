import "./ImageGrid.css"

interface ImageGridProps {
    images: { id: string; urls: { small: string }; alt_description: string }[];
    loading: boolean;
    lastElementCallback?: (node: HTMLImageElement | null) => void;
}

const ImageGrid = ({images, loading, lastElementCallback}: ImageGridProps) => {
    return (
        <div className="image-grid">
            {images.length > 0 ? (
                images.map((image, index) => (
                    <img
                        className="image-grid__item"
                        key={image.id}
                        src={image.urls.small}
                        alt={image.alt_description}
                        ref={index === images.length - 1 ? lastElementCallback || null : null}
                    />
                ))
            ) : (
                !loading && <p>No images found</p>
            )}
        </div>
    );
};

export default ImageGrid;
