'use client';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import './page.scss';
import DocumentApiClient from '@/api/clients/document';
import { useAppSelector } from '@/redux/hooks';
import { useParams, usePathname } from 'next/navigation';
import Document from '@/models/documentModel';
import { DeltaStatic, Sources } from 'quill';


const DocPage = () => {
    const path = usePathname();
    const socketRef = useRef<WebSocket | null>(null);
    const [text, setText] = useState("\n");
    const docId = useParams().id as string;
    const [title, setTitle] = useState('');
    const userState = useAppSelector((state) => state.userSlice.user);

    const [doc, setDoc] = useState<Document>();

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTextChange = (value: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor) => {
        if (source === 'user') {
            
            if (!socketRef.current) {
                return;
            }
            
            if (socketRef.current.readyState === WebSocket.OPEN && text!="\n") {
                const newDelta = delta;
                const content = editor.getText();
                                
                socketRef.current?.send(JSON.stringify({
                    action: 'update',
                    doc_id: docId,
                    user_id: userState?.id,
                    content: content,
                    delta: newDelta,
                }));
            }
        }
    };

    useEffect(
        () => {
            const fetchDoc = async () => {
                try {
                    const docget = await DocumentApiClient.getDoc(
                        userState?.id || '', 
                        docId as string, 
                        userState?.token || ''
                    );

                    setDoc(docget);
                    setTitle(docget.title);
                    setText(docget.content);
                } catch (error) {
                    console.log(error);
                }
            };

            if (userState && docId && text === "\n") {
                fetchDoc();
            }

            let socket: WebSocket;

            if (!socketRef.current) {
                socket = new WebSocket(`ws://localhost:8000/ws/text_editor/${docId}/`);
                socketRef.current = socket;
                socket.addEventListener('open', () => {
                    console.log('WebSocket connection established');
    
                    if (socket.readyState === WebSocket.OPEN ){
                        socket.send(JSON.stringify({ 
                            action: 'join',
                            room: `doc_${docId}`,
                            userId: userState?.id, 
                            docId: docId
                        }));
                    }
                });
    
                socket.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data).content;    
                    
                    switch (data.action) {
                        case 'update':
                            console.log(data.content);
                            setText(data.content);
                            break;
                        case 'join':
                            break;
                        default:
                            break;
                    }
                });
    
                socket.addEventListener('error', (errorEvent) => {
                    console.error('WebSocket error:', errorEvent);
                });

                socket.addEventListener('close', () => {
                    console.log('WebSocket connection closed');
                });

            }

            
        }, [docId, userState, path, text]
    );

    return (
        <div>
            <div>
                <input type="text" placeholder="Title" value={title} onChange={handleTitleChange} required/>
                <span>{doc?.public_link}</span>
            </div>
            <ReactQuill theme="snow" value={text} onChange={handleTextChange} className="editorContainer" />
        </div>
    );
};

export default DocPage;
