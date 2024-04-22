import styles from './fab.module.scss';

export type FABProps = {
    onClick: () => void;
};

const FAB = ({onClick}: FABProps) => { 
    return (
       <button className={styles.fab} onClick={onClick}>
        +
        </button>
    );
};

export default FAB;
