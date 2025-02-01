import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

interface UnsplashImage {
    id: string;
    urls: { small: string };
    alt_description: string;
}

interface UnsplashState {
    images: UnsplashImage[];
    loading: boolean;
    error: string | null;
}

const initialState: UnsplashState = {
    images: [],
    loading: false,
    error: null,
};

const CACHE_NAME = "image-cache";

const fetchFromCache = async (url: string): Promise<string | null> => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    return cachedResponse ? url : null;
};

export const fetchUnsplashImages = createAsyncThunk(
    "unsplash/fetchImages",
    async (searchTerm: string, {rejectWithValue}) => {
        try {
            const cache = await caches.open(CACHE_NAME);
            const cachedUrls: string[] = [];

            const response = await axios.get("https://api.unsplash.com/search/photos", {
                params: {
                    query: searchTerm,
                    per_page: 20,
                    order_by: "popular",
                },
                headers: {
                    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
                },
            });

            const imageUrls: string[] = (response.data as unknown as {
                results: any[]
            }).results.map((img: any) => img.urls.small);

            await Promise.all(
                imageUrls.map(async (url) => {
                    const cachedImage = await fetchFromCache(url);
                    if (!cachedImage) {
                        const res = await fetch(url);
                        cache.put(url, res);
                    }
                    cachedUrls.push(url);
                })
            );

            return cachedUrls;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch images");
        }
    }
);

const unsplashImagesSlice = createSlice({
    name: "unsplash",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnsplashImages.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchUnsplashImages.fulfilled,
                (state, action: PayloadAction<string[]>) => {
                    state.loading = false;
                    state.images = action.payload.map((url) => ({
                        id: url,
                        urls: {small: url},
                        alt_description: "Unsplash Image",
                    }));
                }
            )
            .addCase(fetchUnsplashImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default unsplashImagesSlice.reducer;
