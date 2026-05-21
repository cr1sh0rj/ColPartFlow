import { useMemo, useState } from 'react';
import MovementModal from '../modals/MovementModal';
import ConfirmModal from '../modals/ConfirmModal';
import { formatDate } from '../../utils/formatters';

export default function MovementsPage({ movements, onAddMovement, onDeleteMovement }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    return movements.filter((movement) => {
      const matchesText = movement.product.toLowerCase().includes(search.toLowerCase());
      const matchesType = !filterType || movement.type === filterType;
      return matchesText && matchesType;
    });
  }, [movements, search, filterType]);

  const handleSave = (movement) => {
    onAddMovement({
      id: `${Date.now()}-${Math.random()}`,
      date: formatDate(movement.date),
      type: movement.type,
      product: movement.product,
      category: movement.category,
      quantity: movement.type === 'Entrada'
        ? `+${movement.quantity} und`
        : `-${movement.quantity} und`,
      responsible: movement.responsible,
    });
    setShowModal(false);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Movimientos</div>
        <div className="page-sub">Historial de entradas y salidas</div>
      </div>

      <div className="actions-row">
        <input
          className="search-input"
          type="text"
          id="buscador-mov"
          placeholder="Buscar referencia..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn-secondary" type="button" onClick={() => setFilterType('Entrada')}>
          Entradas
        </button>
        <button className="btn-secondary" type="button" onClick={() => setFilterType('Salida')}>
          Salidas
        </button>
        <button className="btn-secondary" type="button" onClick={() => setFilterType('')}>
          Todos
        </button>
        <button className="btn-primary" type="button" onClick={() => setShowModal(true)}>
          + Registrar
        </button>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Historial de movimientos</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cant.</th>
              <th>Responsable</th>
              <th style={{ width: '80px' }}>Acción</th>
            </tr>
          </thead>
          <tbody id="tabla-movimientos">
            {filtered.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="7">No hay movimientos registrados.</td>
              </tr>
            ) : (
              filtered.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.date}</td>
                  <td>{movement.type}</td>
                  <td>{movement.product}</td>
                  <td>{movement.category}</td>
                  <td>{movement.quantity}</td>
                  <td>{movement.responsible}</td>
                  <td>
                    <button
                      className="btn-delete-row"
                      type="button"
                      onClick={() => setDeleteTarget(movement)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <MovementModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Confirmar eliminación"
        text="¿Estás seguro de que deseas borrar este movimiento?"
        detail={
          deleteTarget
            ? `${deleteTarget.date} — ${deleteTarget.product} — ${deleteTarget.category} — ${deleteTarget.quantity} — Responsable: ${deleteTarget.responsible}`
            : '—'
        }
        confirmLabel="Sí, borrar"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDeleteMovement(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
