import { useEffect, useState } from 'react';

const INITIAL_STATE = {
  code: '',
  category: '',
  name: '',
  stock: '',
  unit: 'und (unidades)',
  cost: '',
  minStock: '',
};

export default function ProductModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(INITIAL_STATE);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    if (!form.code || !form.name || !form.category || form.stock === '' || form.cost === '') {
      setError('Complete todos los campos obligatorios.');
      return;
    }
    setError('');

    const unit = form.unit.split(' ')[0];
    onSave({
      code: form.code.trim(),
      name: form.name.trim(),
      category: form.category,
      stock: parseInt(form.stock, 10) || 0,
      unit,
      cost: parseInt(form.cost, 10) || 0,
      minStock: parseInt(form.minStock, 10) || 0,
    });
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-box">
        <div className="modal-head">
          <div className="modal-title">Registrar nuevo producto</div>
          <button className="modal-close" type="button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="np-codigo">Código</label>
              <input
                className="field-input"
                id="np-codigo"
                type="text"
                placeholder="Ej: FIL-010"
                value={form.code}
                onChange={handleChange('code')}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="np-categoria">Categoría</label>
              <select
                className="field-select"
                id="np-categoria"
                value={form.category}
                onChange={handleChange('category')}
              >
                <option value="">Seleccionar...</option>
                <option>Filtros</option>
                <option>Aceites</option>
                <option>Repuestos</option>
              </select>
            </div>
          </div>
          <div className="form-row-full">
            <div className="form-field">
              <label className="field-label" htmlFor="np-nombre">Nombre del producto</label>
              <input
                className="field-input"
                id="np-nombre"
                type="text"
                placeholder="Ej: Filtro de aire Bosch S3001"
                value={form.name}
                onChange={handleChange('name')}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="np-stock">Stock inicial</label>
              <input
                className="field-input"
                id="np-stock"
                type="number"
                placeholder="0"
                min="0"
                value={form.stock}
                onChange={handleChange('stock')}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="np-unidad">Unidad</label>
              <select
                className="field-select"
                id="np-unidad"
                value={form.unit}
                onChange={handleChange('unit')}
              >
                <option>und (unidades)</option>
                <option>lt (litros)</option>
                <option>kg (kilogramos)</option>
                <option>caja</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="np-costo">Costo unitario ($)</label>
              <input
                className="field-input"
                id="np-costo"
                type="number"
                placeholder="0"
                min="0"
                value={form.cost}
                onChange={handleChange('cost')}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="np-minimo">Stock mínimo</label>
              <input
                className="field-input"
                id="np-minimo"
                type="number"
                placeholder="0"
                min="0"
                value={form.minStock}
                onChange={handleChange('minStock')}
              />
            </div>
          </div>
          <div id="modal-error" style={{ fontSize: '12px', color: '#e24b4a', minHeight: '16px' }}>
            {error}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" type="button" onClick={handleSubmit}>
            Guardar producto
          </button>
        </div>
      </div>
    </div>
  );
}
