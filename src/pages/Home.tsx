import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store.ts";
import {fetchUnsplashImages} from "../redux/slice/unsplashImagesSlice.ts";
import {useNavigate} from "react-router-dom";

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;

const Home = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const lastChange = useRef<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const {images, loading, error} = useAppSelector((state) => state.unsplash);

    useEffect(() => {
        if (!searchTerm) return;

        dispatch(fetchUnsplashImages(searchTerm));
    }, [searchTerm, dispatch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (lastChange.current) clearTimeout(lastChange.current);

        lastChange.current = setTimeout(() => {
            setSearchTerm(e.target.value);
        }, 800);
    };

    return (
        <>
            <header>
                <h1>Unsplash Images</h1>
                <input placeholder="ძებნა..." onChange={handleSearch}/>
                <button onClick={() => navigate("/history")}>View History</button>
            </header>

            {loading && <p>Loading images...</p>}
            {error && <p>Error: {error}</p>}

            <div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px"}}>
                    {images.length > 0 ? (
                        images.map((image) => (
                            <img key={image.id} src={image.urls.small} alt={image.alt_description}/>
                        ))
                    ) : (
                        !loading && <p>No images found</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;