import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store.ts";
import {fetchUnsplashImages, resetImages} from "../redux/slice/unsplashImagesSlice.ts";
import useInfiniteScroll from "../hooks/useInfiniteScroll.ts";
import Header from "../layout/Header.tsx";

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;

const Home = () => {
    const dispatch = useAppDispatch();
    const lastChange = useRef<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);

    const {images, loading, error, page} = useAppSelector((state) => state.unsplash);

    useEffect(() => {
        if (images.length === 0) {
            dispatch(fetchUnsplashImages({searchTerm: null, page: 1}));
        }
    }, [dispatch, images.length]);

    const {lastElementCallBack} = useInfiniteScroll({
        loading,
        fetchMore: () => {
            if (!loading) dispatch(fetchUnsplashImages({searchTerm, page}));
        },
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (lastChange.current) clearTimeout(lastChange.current);

        lastChange.current = setTimeout(() => {
            setSearchTerm(e.target.value);
            dispatch(resetImages());
            dispatch(fetchUnsplashImages({searchTerm: e.target.value, page: 1}));
        }, 800);
    };

    return (
        <>
            <Header headingTitle={'Unsplash Images'} hasSearchInput onSearch={handleSearch}/>

            {loading && page === 1 && <p>Loading images...</p>}
            {error && <p>Error: {error}</p>}

            <div className="images-container">
                <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px"}}>
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <img
                                style={{maxWidth: '320px', width: '100%'}}
                                key={image.id}
                                src={image.urls.small}
                                alt={image.alt_description}
                                ref={index === images.length - 1 ? lastElementCallBack : null}
                            />
                        ))
                    ) : (
                        !loading && <p>No images found</p>
                    )}
                </div>
            </div>

            {loading && page > 1 && <p>Loading more images...</p>}
        </>
    );
};

export default Home;
