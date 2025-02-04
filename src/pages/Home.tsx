import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store.ts";
import {fetchUnsplashImages, resetImages} from "../redux/slice/unsplashImagesSlice.ts";
import useInfiniteScroll from "../hooks/useInfiniteScroll.ts";
import Header from "../layout/Header.tsx";
import ImageGrid from "../components/ImageGrid.tsx";

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

            <ImageGrid images={images} loading={loading} lastElementCallback={lastElementCallBack}/>;

            {loading && page > 1 && <p>Loading more images...</p>}
        </>
    );
};

export default Home;
