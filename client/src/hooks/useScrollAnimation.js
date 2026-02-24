import { useEffect, useRef } from 'react';

export default function useScrollAnimation(options = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    if (options.once !== false) observer.unobserve(el);
                }
            },
            { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin, options.once]);

    return ref;
}
