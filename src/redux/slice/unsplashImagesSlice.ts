import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

interface UnsplashImage {
    id: string;
    urls: { small: string };
    alt_description: string;
}

interface UnsplashState {
    images: UnsplashImage[];
    searchHistory: string[];
    loading: boolean;
    error: string | null;
}

const initialState: UnsplashState = {
    images: [],
    searchHistory: [],
    loading: false,
    error: null,
};

// const CACHE_NAME = "image-cache";

// const fetchFromCache = async (url: string): Promise<string | null> => {
//     const cache = await caches.open(CACHE_NAME);
//     const cachedResponse = await cache.match(url);
//     return cachedResponse ? url : null;
// };

export const fetchUnsplashImages = createAsyncThunk(
    "unsplash/fetchImages",
    async (searchTerm: string | null, {rejectWithValue}) => {
        try {
            const isSearching = searchTerm ? searchTerm : false; // True if searchTerm exists
            console.log(isSearching)
            const url = isSearching
                ? "https://api.unsplash.com/search/photos"
                : "https://api.unsplash.com/photos";

            const params = isSearching
                ? {query: searchTerm, per_page: 20, order_by: "popular"}
                : {per_page: 20, order_by: "popular"};

            const response = await axios.get(url, {
                params,
                headers: {Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`},
            });

            const imageUrls: UnsplashImage[] = isSearching
                ? (response.data as unknown as {
                    results: any[];
                }).results.map((img: any) => ({
                    id: img.id,
                    urls: {small: img.urls.small},
                    alt_description: img.alt_description || "Unsplash Image",
                }))
                : response.data.map((img: any) => ({
                    id: img.id,
                    urls: {small: img.urls.small},
                    alt_description: img.alt_description || "Unsplash Image",
                }));

            return {searchTerm, imageUrls};
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch images");
        }
    }
);

const unsplashImagesSlice = createSlice({
    name: "unsplash",
    initialState,
    reducers: {
        // addToHistory: (state, action: PayloadAction<string>) => {
        //     if (!state.searchHistory.includes(action.payload)) {
        //         state.searchHistory.unshift(action.payload);
        //     }
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnsplashImages.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchUnsplashImages.fulfilled,
                (state, action: PayloadAction<{ searchTerm: string | null; imageUrls: UnsplashImage[] }>) => {
                    state.loading = false;
                    state.images = action.payload.imageUrls;

                    if (action.payload.searchTerm && !state.searchHistory.includes(action.payload.searchTerm)) {
                        state.searchHistory.unshift(action.payload.searchTerm);
                    }
                }
            )
            .addCase(fetchUnsplashImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// export const {addToHistory} = unsplashImagesSlice.actions;
export default unsplashImagesSlice.reducer;
