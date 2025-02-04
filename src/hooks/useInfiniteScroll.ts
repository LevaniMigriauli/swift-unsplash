import {useCallback, useRef} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";

interface UseInfiniteScrollProps {
    loading: boolean;
    fetchMore: () => void;
}

const useInfiniteScroll = ({loading, fetchMore}: UseInfiniteScrollProps) => {
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useRef<HTMLImageElement | null>(null);
    const hasError = useSelector((state: RootState) => state.unsplash.hasError);
    const hasMore = useSelector((state: RootState) => state.unsplash.hasMore);

    const lastElementCallBack = useCallback(
        (node: HTMLImageElement | null) => {
            if (loading || hasError || !hasMore) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log("Fetching more images...");
                        fetchMore();
                        observer.current?.unobserve(entry.target);
                    }
                });
            }, {root: null, threshold: 0.1});

            if (node) observer.current.observe(node);
        },
        [loading, fetchMore, hasError, hasMore]
    );

    return {lastElementRef, lastElementCallBack};
};

export default useInfiniteScroll;
