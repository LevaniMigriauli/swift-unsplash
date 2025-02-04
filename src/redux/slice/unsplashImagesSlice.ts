import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export interface UnsplashImage {
    id: string;
    urls: { small: string, full: string };
    alt_description: string;
    user: { total_likes: number }
}

interface UnsplashApiResponse {
    results: UnsplashImage[];
}

interface UnsplashState {
    images: UnsplashImage[];
    searchHistory: string[];
    loading: boolean;
    error: string | null;
    page: number;
    searchTerm: string | null;
    hasError: boolean;
}

const initialState: UnsplashState = {
    images: [],
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
    loading: false,
    error: null,
    page: 1,
    searchTerm: null,
    hasError: false,
}

const CACHE_NAME = "unsplash-cache";

export const fetchUnsplashImages = createAsyncThunk(
    "unsplash/fetchImages",
    async ({searchTerm, page}: { searchTerm: string | null; page: number }, {rejectWithValue}) => {
        try {
            const isSearching = Boolean(searchTerm);
            const url = isSearching
                ? "https://api.unsplash.com/search/photos"
                : "https://api.unsplash.com/photos";

            const params = isSearching
                ? {query: searchTerm, per_page: 20, page, order_by: "popular"}
                : {per_page: 20, page, order_by: "popular"};

            const cacheKey = `${url}?${new URLSearchParams(params as any).toString()}`;
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(cacheKey);

            if (cachedResponse) {
                const cachedData = await cachedResponse.json();
                return {searchTerm, page, imageUrls: cachedData};
            }

            const response = await axios.get(url, {
                params,
                headers: {Authorization: `Client-ID CUv9IfUKBwAScwKFmfb-QJMFeXNvHUMeJkuTUWAsxd8`},
            });

            const imageUrls: UnsplashImage[] = isSearching
                ? (response.data as UnsplashApiResponse).results
                : (response.data as UnsplashImage[]);

            cache.put(cacheKey, new Response(JSON.stringify(imageUrls)));

            return {searchTerm, page, imageUrls};
        } catch (error: any) {
            if (error.response?.status === 403) {
                return rejectWithValue({message: "API Limit Reached", code: 403});
            }

            return rejectWithValue({message: error.message || "Failed to fetch images", code: error.response?.status});
        }
    }
);

const unsplashImagesSlice = createSlice({
    name: "unsplash",
    initialState,
    reducers: {
        resetImages: (state) => {
            state.images = [];
            state.page = 1;
            state.error = null;
            state.loading = false;
            state.searchTerm = null;
            state.hasError = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnsplashImages.pending, (state) => {
                if (state.hasError) return;
                state.loading = true;
            })
            .addCase(
                fetchUnsplashImages.fulfilled,
                (state, action: PayloadAction<{
                    searchTerm: string | null;
                    page: number;
                    imageUrls: UnsplashImage[]
                }>) => {
                    state.loading = false;
                    state.hasError = false;

                    if (action.payload.page === 1) {
                        state.images = action.payload.imageUrls;
                    } else {
                        state.images = [...state.images, ...action.payload.imageUrls];
                    }

                    state.page = action.payload.page + 1;
                    state.searchTerm = action.payload.searchTerm;

                    if (action.payload.searchTerm && !state.searchHistory.includes(action.payload.searchTerm)) {
                        state.searchHistory.unshift(action.payload.searchTerm);
                        localStorage.setItem("searchHistory", JSON.stringify(state.searchHistory));
                    }
                }
            )
            .addCase(fetchUnsplashImages.rejected, (state, action: PayloadAction<{
                message: string;
                code?: number
            } | undefined>) => {
                state.loading = false;

                if (action.payload) {
                    state.error = action.payload.message;
                    if (action.payload.code === 403) {
                        state.hasError = true;
                    }
                } else {
                    state.error = "An unknown error occurred.";
                }
            });
    },
});

export const {resetImages} = unsplashImagesSlice.actions;
export default unsplashImagesSlice.reducer;
