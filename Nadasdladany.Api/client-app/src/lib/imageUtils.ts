export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return '/Nadasdladany-hero-banner.jpg';
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;

    const baseUrl = import.meta.env.DEV ? 'https://localhost:7284' : '';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};