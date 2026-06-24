export interface Representative {
    id: number;
    name: string;
    role: number | string;
    customTitleOverride?: string;
    email?: string;
    phoneNumber?: string;
    receptionHoursInfo?: string;
    imageUrl?: string;
    biography?: string;
    displayOrder: number;
}

export interface DocumentFile {
    id: number;
    title: string;
    description?: string;
    filePath: string;
    fileType: string;
    fileSizeInBytes: number;
    createdAt: string;
    documentCategoryId: number;
    categoryName: string;
}