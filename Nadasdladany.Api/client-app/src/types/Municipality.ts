export interface Representative {
    id: number;
    name: string;
    role: string;
    customTitle?: string;
    email?: string;
    phoneNumber?: string;
    imageUrl?: string;
    biography?: string;
}

export interface DocumentFile {
    id: number;
    title: string;
    description?: string;
    filePath: string;
    fileType: string;
    fileSizeInBytes: number;
    publishedDate: string;
    categoryName: string;
}