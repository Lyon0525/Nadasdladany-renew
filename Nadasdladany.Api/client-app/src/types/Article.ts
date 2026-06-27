export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImageUrl?: string;
    publishedDate: string;
    author?: string;
    categoryId: number;
    categoryName: string;
}