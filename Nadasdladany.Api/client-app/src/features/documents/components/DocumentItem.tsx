import { FileText, Download, FileArchive, FileSpreadsheet } from 'lucide-react';
import { type DocumentFile } from '../../../types/Municipality';

export const DocumentItem = ({ doc }: { doc: DocumentFile }) => {
    const getIcon = (type: string) => {
        if (type.includes('pdf')) return <FileText className="text-red-500" />;
        if (type.includes('xls')) return <FileSpreadsheet className="text-green-600" />;
        if (type.includes('zip')) return <FileArchive className="text-orange-500" />;
        return <FileText className="text-blue-500" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
            <div className="p-4 bg-secondary rounded-2xl group-hover:scale-110 transition-transform">
                {getIcon(doc.fileType)}
            </div>
            <div className="flex-grow">
                <h4 className="font-bold text-primary mb-1">{doc.title}</h4>
                <div className="flex gap-4 text-xs text-gray-400">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-primary font-medium">{doc.categoryName}</span>
                    <span>{new Date(doc.publishedDate).toLocaleDateString('hu-HU')}</span>
                    <span>{formatSize(doc.fileSizeInBytes)}</span>
                </div>
            </div>
            <a
                href={doc.filePath}
                target="_blank"
                className="p-3 rounded-full hover:bg-accent hover:text-white transition-colors text-accent border border-accent/20"
            >
                <Download size={20} />
            </a>
        </div>
    );
};