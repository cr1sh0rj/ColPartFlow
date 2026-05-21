import { useEffect, useState } from 'react';

const INITIAL_STATE = {
  type: '',
  date: '',
  product: '',
  category: '',
  quantity: '',
  responsible: '',
};

export default function MovementModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm({
        ...INITIAL_STATE,
        date: new Date().toISOString().split('T')[0],
      });
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    if (!form.type || !form.date || !form.product || !form.category || !form.quantity || !form.responsible) {
      setError('Complete todos los campos.');
      return;
    }
    setError('');
    onSave({
      type: form.type,
      date: form.date,
      product: form.product.trim(),
      category: form.category,
      quantity: form.quantity.trim(),
      responsible: form.responsible.trim(),
    });
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-box">
        <div className="modal-head">
          <div className="modal-title">Registrar movimiento</div>
          <button className="modal-close" type="button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="mov-tipo">Tipo *</label>
              <select
                className="field-select"
                id="mov-tipo"
                value={form.type}
                onChange={handleChange('type')}
              >
                <option value="">Seleccionar...</option>
                <option>Entrada</option>
                <option>Salida</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="mov-fecha">Fecha *</label>
              <input
                className="field-input"
                id="mov-fecha"
                type="date"
                value={form.date}
                onChange={handleChange('date')}
              />
            </div>
          </div>
          <div className="form-row-full">
            <div className="form-field">
              <label className="field-label" htmlFor="mov-producto">Producto *</label>
              <input
                className="field-input"
                id="mov-producto"
                type="text"
                placeholder="Nombre del producto..."
                value={form.product}
                onChange={handleChange('product')}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="mov-categoria">Categoría *</label>
              <select
                className="field-select"
                id="mov-categoria"
                value={form.category}
                onChange={handleChange('category')}
              >
                <option value="">Seleccionar...</option>
                <option>Filtros</option>
                <option>Aceites</option>
                <option>Repuestos</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="mov-cantidad">Cantidad *</label>
              <input
                className="field-input"
                id="mov-cantidad"
                type="number"
                placeholder="0"
                min="1"
                value={form.quantity}
                onChange={handleChange('quantity')}
              />
            </div>
          </div>
          <div className="form-row-full">
            <div className="form-field">
              <label className="field-label" htmlFor="mov-responsable">Responsable *</label>
              <input
                className="field-input"
                id="mov-responsable"
                type="text"
                placeholder="Nombre del responsable..."
                value={form.responsible}
                onChange={handleChange('responsible')}
              />
            </div>
          </div>
          <div id="mov-error" style={{ fontSize: '12px', color: '#e24b4a', minHeight: '16px' }}>
            {error}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" type="button" onClick={handleSubmit}>
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
