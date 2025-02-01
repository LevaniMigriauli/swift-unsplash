import {configureStore} from "@reduxjs/toolkit";
import unsplashReducer from "./slice/unsplashImagesSlice";
import imageCacheReducer from "./slice/imageCacheSlice";

export const store = configureStore({
    reducer: {
        unsplash: unsplashReducer,
        imageCache: imageCacheReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store