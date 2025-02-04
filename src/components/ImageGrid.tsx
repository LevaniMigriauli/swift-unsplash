import {useRef, useState} from "react";
import "./ImageGrid.css";
import CustomModal, {CustomModalRef} from "./Modal.tsx";
import {UnsplashImage} from "../redux/slice/unsplashImagesSlice.ts";

interface ImageGridProps {
    images: UnsplashImage[];
    loading: boolean;
    lastElementCallback?: (node: HTMLImageElement | null) => void;
}

const ImageGrid = ({images, loading, lastElementCallback}: ImageGridProps) => {
    const modalRef = useRef<CustomModalRef>(null);
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; likes: number } | null>(null);

    const handleImageClick = (src: string, likes: number, alt: string) => {
        setSelectedImage({src, likes, alt});
        modalRef.current?.handleOpenModal();
    };

    return (
        <div className="image-grid">
            {images.length > 0 ? (
                images.map((image, index) => (
                    <div key={`${image.id}-${index}`} className="image-grid__item">
                        <img
                            src={image.urls.small}
                            alt={image.alt_description}
                            ref={index === images.length - 1 ? lastElementCallback || null : null}
                            onClick={() => handleImageClick(image.urls.full, image.user.total_likes, image.alt_description)}
                            style={{cursor: "pointer"}}
                        />
                    </div>
                ))
            ) : (
                !loading && <p>No images found</p>
            )}

            <CustomModal ref={modalRef} handleModalClose={() => setSelectedImage(null)} width="50%">
                <div style={{maxHeight: "90vh"}}>
                    {selectedImage && (
                        <>
                            <img src={selectedImage.src} alt={selectedImage.alt}
                                 style={{maxHeight: "50%", maxWidth: "100%"}}/>
                            <p style={{color: "black"}}>
                                Total Likes: <span>{selectedImage.likes}</span>
                            </p>
                        </>
                    )}
                    <button onClick={modalRef?.current?.handleCloseModal}>Close Modal</button>
                </div>
            </CustomModal>
        </div>
    );
};

export default ImageGrid;
