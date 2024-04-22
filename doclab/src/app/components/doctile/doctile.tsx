import React from 'react';
import styles from './doctile.module.scss';

export type DocumentTileProps = {
    title: string;
    created_at: string;
    is_public: boolean;
    onClick: () => void;
    onDelete: () => void;
    onPublicChange: (newValue: boolean) => void;
};

const DocumentTile = ({
        title, 
        created_at, 
        is_public, 
        onClick,
        onPublicChange, 
        onDelete 
    }:DocumentTileProps
) => {
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();

        onPublicChange(e.target.checked);
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        onDelete();
    };

    return (
        <div className={styles.listTile} onClick={onClick}>
            <div className={styles.listTileContent}>
                <p>{title}</p>
            </div>
            <div>
                <span>{created_at}</span>
                <input 
                        type="checkbox" 
                        checked={is_public} 
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleCheckboxChange(e)}
                    />
                <button onClick={(e) => handleDeleteClick(e)}>Delete</button>
            </div>
        </div>
    );
};

export default DocumentTile;
