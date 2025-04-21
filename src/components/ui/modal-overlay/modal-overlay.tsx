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
    data-testid='modal-overlay'
    onClick={onClick}
  />
);
