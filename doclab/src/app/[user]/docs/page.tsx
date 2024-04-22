'use client';

import styles from './page.module.scss';
import FAB from '@/app/components/fab/fab';
import DocTile from '@/app/components/doctile/doctile'; // import DocTile component

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import Document from '@/models/documentModel';
import DocumentApiClient from '@/api/clients/document';


const DocHomePage = () => {
    const router = useRouter();
    const path = usePathname();
    const userState = useAppSelector((state) => state.userSlice.user);

    const [docs, setDocs] = useState<Document[]>([]);

    const handlePublicChange = (id: string, newValue: boolean) => {
        const initState = docs;
        const toUpdateDoc = docs.find(doc => doc.id === id);

        setDocs(docs.map(doc => doc.id === id ? { ...doc, is_public: newValue } : doc));

        try{
            DocumentApiClient.updateDoc(
                userState?.id || '', 
                id, 
                {
                    ...toUpdateDoc!,
                    is_public: newValue
                },  
                userState?.token || '');
        } catch (error) {
            setDocs(initState);
        }
    };

    const handleDelete = async (id: string) => {
        const initState = docs;
        setDocs(docs.filter(doc => doc.id !== id));

        try {
            await DocumentApiClient.deleteDoc(userState?.id || '', id, userState?.token || '');
        } catch (error) {
            setDocs(initState);
        }
    };

    useEffect(() => {
        const handleRouteChange = (url: string) => {
          if (userState && (url === '/login' || url === '/signup')) {
            router.push(`${userState?.id}/docs/`);
          }
        };

        const fetchDocs = async () => {
            try {
                const documents = await DocumentApiClient.getDocs(
                    userState?.id || '', 
                    userState?.token || ''
                ); // Pass user ID if available
                setDocs(documents);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        handleRouteChange(path);
        fetchDocs();
        
      }, [userState, path, router]);
    

    return (
        <div className={styles.docsHome}>
            <nav className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>WriteIt!</h2>
            </nav>
            <div className={styles.content}>
                <div className={styles.title}>
                    <h1>Your Docs</h1>
                    <span>{userState?.email}</span>
                </div>
                {docs.length==0 ? <p>No docs found</p> :  docs.map(doc => (
                    <DocTile 
                        key={doc.id}
                        onClick={() => {
                            router.push(`${path}/${doc.id}`);
                        }}
                        onDelete={() => handleDelete(doc.id || '')}
                        onPublicChange={(newValue) => handlePublicChange(doc.id || '', newValue)}
                        created_at={doc.created_at || ''}
                        is_public={doc.is_public || false}
                        {...doc}
                    />
                ))}
            </div>
            <FAB onClick={() => {
                router.push(`${path}/create`);
            }} />
        </div>
    );
};

export default DocHomePage;
