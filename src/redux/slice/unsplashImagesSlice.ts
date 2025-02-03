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
    page: number;
    searchTerm: string | null;
}

const initialState: UnsplashState = {
    images: [],
    searchHistory: [],
    loading: false,
    error: null,
    page: 1,
    searchTerm: null,
};

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

            return {searchTerm, page, imageUrls};
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch images");
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnsplashImages.pending, (state) => {
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

                    if (action.payload.page === 1) {
                        state.images = action.payload.imageUrls;
                    } else {
                        state.images = [...state.images, ...action.payload.imageUrls];
                    }

                    state.page = action.payload.page + 1;
                    state.searchTerm = action.payload.searchTerm;

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

export const {resetImages} = unsplashImagesSlice.actions;
export default unsplashImagesSlice.reducer;
