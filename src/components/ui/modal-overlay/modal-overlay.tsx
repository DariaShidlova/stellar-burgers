// import styles from './modal-overlay.module.css';

// export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
//   <div className={styles.overlay} onClick={onClick} />
// );
import styles from './modal-overlay.module.css';

type TModalOverlayUIProps = {
  onClick: () => void;
  'data-testid'?: string;
};

export const ModalOverlayUI = ({
  onClick,
  'data-testid': testId
}: TModalOverlayUIProps) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    data-testid={testId || 'modal-overlay'}
  />
);
