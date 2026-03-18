import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useCallback, useEffect, useState, useRef } from 'react';
import './simple-editor.css';

const MenuBar = ({ editor }) => {
    const [isListening, setIsListening] = useState(false);
    const [speechLang, setSpeechLang] = useState('en-IN');
    const recognitionRef = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false; // Set to false to only get final words mapped cleanly
            
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
                if (finalTranscript && editor) {
                    editor.chain().focus().insertContent(finalTranscript).run();
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [editor]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return alert("Your browser doesn't support voice typing. Try Google Chrome.");
        
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.lang = speechLang;
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, [isListening, speechLang]);

    if (!editor) {
        return null;
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="btn-toolbar mb-2 gap-1 p-2 border-bottom bg-light rounded-top">
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="border-0 rounded bg-transparent"
                title="Undo"
            >
                <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="border-0 rounded bg-transparent"
                title="Redo"
            >
                <i className="bi bi-arrow-clockwise"></i>
            </button>
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={` border-0 rounded ${editor.isActive('bold') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Bold"
            >
                <i className="bi bi-type-bold"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={` border-0 rounded ${editor.isActive('italic') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Italic"
            >
                <i className="bi bi-type-italic"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={` border-0 rounded ${editor.isActive('strike') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Strike"
            >
                <i className="bi bi-type-strikethrough"></i>
            </button>
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={` border-0 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-tertiary' : 'bg-transparent'}`}
                title="H1"
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={` border-0 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-tertiary' : 'bg-transparent'}`}
                title="H2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={` border-0 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-tertiary' : 'bg-transparent'}`}
                title="H3"
            >
                H3
            </button>
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={` border-0 rounded ${editor.isActive('bulletList') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Bullet List"
            >
                <i className="bi bi-list-ul"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={` border-0 rounded ${editor.isActive('orderedList') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Ordered List"
            >
                <i className="bi bi-list-ol"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={` border-0 rounded ${editor.isActive('codeBlock') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Code Block"
            >
                <i className="bi bi-code-square"></i>
            </button>
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={setLink}
                className={` border-0 rounded ${editor.isActive('link') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Add Link"
            >
                <i className="bi bi-link"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                className="border-0 rounded bg-transparent"
                title="Unlink"
            >
                <i className="bi bi-link-45deg"></i>
            </button>
            <div className="vr mx-1"></div>
            {/* <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={` border-0 rounded ${editor.isActive('blockquote') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Blockquote"
            >
                <i className="bi bi-quote"></i>
            </button> */}
            <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={` border-0 rounded ${editor.isActive('horizontalRule') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Horizontal Rule"
            >
                <i className="bi bi-hr"></i>
            </button>
            <div className="vr mx-1"></div>
            <input
                type="color"
                onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                title="Text Color"
                className="border-0 bg-transparent"
                style={{ width: '17px', height: '21px', paddingTop: '6px' }}
            />
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className="border-0 rounded bg-transparent"
                title="Insert Table"
            >
                <i className="bi bi-table"></i>
            </button>
            {editor.isActive('table') && (
                <>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().addColumnBefore().run()}
                        className="border-0 rounded bg-transparent"
                        title="Add Column Before"
                    >
                        <i className="bi bi-layout-three-columns"></i>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        className="border-0 rounded bg-transparent"
                        title="Add Row After"
                    >
                        <i className="bi bi-layout-text-window-reverse"></i>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="border-0 rounded bg-transparent text-danger"
                        title="Delete Table"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </>
            )}
            <div className="vr mx-1"></div>
            <select 
                value={speechLang} 
                onChange={(e) => {
                    setSpeechLang(e.target.value);
                    if (isListening) {
                        recognitionRef.current.stop();
                    }
                }} 
                className="form-select form-select-sm border-0 bg-transparent"
                style={{ width: 'auto', minWidth: '100px', cursor: 'pointer' }}
                title="Voice Typing Language"
            >
                <option value="en-IN">English</option>
                <option value="hi-IN">Hindi</option>
                <option value="ta-IN">Tamil</option>
                <option value="gu-IN">Gujarati</option>
                <option value="bn-IN">Bengali</option>
                <option value="te-IN">Telugu</option>
                <option value="kn-IN">Kannada</option>
                <option value="ml-IN">Malayalam</option>
            </select>
            <button
                type="button"
                onClick={toggleListening}
                className={`border-0 rounded ${isListening ? 'bg-danger text-white pulse-animation' : 'bg-transparent'}`}
                title={isListening ? 'Stop Voice Typing' : 'Start Voice Typing'}
            >
                <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`}></i>
            </button>
        </div>
    );
};

export const SimpleEditor = ({ content, onChange, isRequired = false }) => {
    // Force re-render on transaction to update toolbar state
    const [, forceUpdate] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextStyle,
            Color,
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // Trigger re-render on selection updates and other transactions so buttons update
        onTransaction: () => {
            forceUpdate(prev => prev + 1);
        },
    });

    // Sync external content changes (e.g. from AI or initial load)
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            // Only update if focused to avoid overwriting while typing, 

            if (!editor.isFocused) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    return (
        <div className="border rounded-3 simple-editor-wrapper position-relative" style={{ minHeight: '320px' }}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-3" style={{ minHeight: '280px' }} />

            {/* Hidden input for form validation */}
            <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0, position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none' }}
                required={isRequired}
                value={editor && !editor.isEmpty ? 'valid' : ''}
                onChange={() => { }}
                onInvalid={(e) => e.preventDefault()}
            />
            {editor && editor.isEmpty && isRequired && <div className="invalid-feedback">Please provide content</div>}
        </div>
    );
};
