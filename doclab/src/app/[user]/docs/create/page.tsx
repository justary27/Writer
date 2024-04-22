'use client';

import { ChangeEvent, useState } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './page.scss';
import FAB from '@/app/components/fab/fab';
import { useAppSelector } from '@/redux/hooks';
import DocumentApiClient from '@/api/clients/document';
import { useRouter } from 'next/navigation';



const DocPage = () => {
    const router = useRouter();
    const [doc, setDoc] = useState("\n");
    const [title, setTitle] = useState('');
    const userState = useAppSelector((state) => state.userSlice.user);


    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleSubmit = async () => {
        try {
           const newdoc = await DocumentApiClient.createDoc(
                userState?.id || '', 
                {
                title: title, content: doc,
                owner: userState!,
                }, 
                userState?.token || ''
            );


            router.replace(`/${userState?.id}/docs/`);
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <input type="text" placeholder="Title" value={title} onChange={handleTitleChange} required/>
            </div>
            <ReactQuill theme="snow" value={doc} onChange={setDoc} className="editorContainer" />
            <FAB onClick={() => handleSubmit()}/>
        </div>
    );
};

export default DocPage;
