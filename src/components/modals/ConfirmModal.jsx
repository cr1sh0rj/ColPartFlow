export default function ConfirmModal({
  open,
  title,
  text,
  detail,
  confirmLabel,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay open">
      <div className="modal-box-sm">
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="modal-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="delete-confirm-text">{text}</div>
          <div className="delete-confirm-detail">{detail || '—'}</div>
          <div style={{ fontSize: '12px', color: '#A32D2D', marginTop: '12px' }}>
            Esta acción no se puede deshacer.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-danger" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
