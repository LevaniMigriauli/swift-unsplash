import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store.ts";
import { fetchUnsplashImages } from "../redux/slice/unsplashImagesSlice.ts";

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;

const History = () => {
    const dispatch = useAppDispatch();
    const searchHistory = useAppSelector((state) => state.unsplash.searchHistory);
    const { images, loading, error } = useAppSelector((state) => state.unsplash);

    const [selectedQuery, setSelectedQuery] = useState<string>("");

    const handleHistoryClick = (query: string) => {
        setSelectedQuery(query);
        dispatch(fetchUnsplashImages(query));
    };

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
                    {loading && <p>Loading images...</p>}
                    {error && <p>Error: {error}</p>}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                        {images.length > 0 ? (
                            images.map((image) => (
                                <img key={image.id} src={image.urls.small} alt={image.alt_description} />
                            ))
                        ) : (
                            !loading && <p>No images found</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default History;
