import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Quote, Undo, Redo } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  content: string;
  onChange: (html: string) => void; // Itt is legyen ott a string típus
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('URL címe:');
        if (url) editor.chain().focus().setLink({ href: url }).run();
    };

    const buttons = [
        { icon: <Bold size={18} />, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
        { icon: <Italic size={18} />, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
        { icon: <List size={18} />, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
        { icon: <ListOrdered size={18} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
        { icon: <Quote size={18} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
        { icon: <LinkIcon size={18} />, action: addLink, active: 'link' },
    ];

    return (
        <div className="flex flex-wrap gap-2 p-3 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
            {buttons.map((btn, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={btn.action}
                    className={cn(
                        "p-2 rounded-lg transition-all",
                        editor.isActive(btn.active) ? "bg-accent text-white" : "text-gray-400 hover:bg-white"
                    )}
                >
                    {btn.icon}
                </button>
            ))}
            <div className="ml-auto flex gap-1">
                <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 text-gray-400"><Undo size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 text-gray-400"><Redo size={18} /></button>
            </div>
        </div>
    );
};

export const RichTextEditor = ({ content, onChange }: Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl outline-none min-h-[300px] p-6 focus:ring-0 max-w-none',
            },
        },
    });

    return (
        <div className="border border-gray-100 rounded-3xl overflow-hidden focus-within:border-accent transition-colors bg-white shadow-sm">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};