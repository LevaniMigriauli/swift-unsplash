import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {AppDispatch, RootState} from "../redux/store.ts";
import {fetchUnsplashImages, resetImages} from "../redux/slice/unsplashImagesSlice.ts";
import useInfiniteScroll from "../hooks/useInfiniteScroll.ts";

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;

const History = () => {
    const dispatch = useAppDispatch();
    const searchHistory = useAppSelector((state) => state.unsplash.searchHistory);
    const {images, loading, error, page, searchTerm} = useAppSelector((state) => state.unsplash);

    const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

    const handleHistoryClick = (query: string) => {
        if (query === selectedQuery) return;
        setSelectedQuery(query);
        dispatch(resetImages());
        dispatch(fetchUnsplashImages({searchTerm: query, page: 1}));
    };

    const {lastElementCallBack} = useInfiniteScroll({
        loading,
        fetchMore: () => {
            if (!loading && selectedQuery) {
                dispatch(fetchUnsplashImages({searchTerm: selectedQuery, page}));
            }
        },
    });

    return (
        <>
            <header>
                <h1>Search History</h1>
            </header>

            <ul>
                {searchHistory.length > 0 ? (
                    searchHistory.map((query, index) => (
                        <li key={index}>
                            <button onClick={() => handleHistoryClick(query)}>{query}</button>
                        </li>
                    ))
                ) : (
                    <p>No search history found</p>
                )}
            </ul>

            {selectedQuery && (
                <>
                    <h2>Showing results for: {selectedQuery}</h2>
                    {loading && page === 1 && <p>Loading images...</p>}
                    {error && <p>Error: {error}</p>}

                    <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px"}}>
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <img
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

                    {loading && page > 1 && <p>Loading more images...</p>}
                </>
            )}
        </>
    );
};

export default History;
