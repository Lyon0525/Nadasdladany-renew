export const getImageUrl = (path: string | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80';
    if (path.startsWith('http')) return path;

    const baseUrl = import.meta.env.DEV ? 'https://localhost:7001' : '';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};