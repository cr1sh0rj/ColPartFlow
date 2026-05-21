import { useMemo, useState } from 'react';
import ConfirmModal from '../modals/ConfirmModal';
import { formatCurrency } from '../../utils/formatters';

export default function InvoicesPage({ invoices, onNewInvoice, onDeleteInvoice }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    return invoices.filter((invoice) => {
      const textMatch = invoice.number.toLowerCase().includes(search.toLowerCase())
        || invoice.client.toLowerCase().includes(search.toLowerCase());
      const statusMatch = !status || invoice.status === status;
      return textMatch && statusMatch;
    });
  }, [invoices, search, status]);

  return (
    <>
      <div className="page-header">
        <div className="page-title">Facturas</div>
        <div className="page-sub">Listado completo de facturas emitidas</div>
      </div>

      <div className="actions-row">
        <input
          className="search-input"
          type="text"
          id="buscador-fac"
          placeholder="Buscar factura o cliente..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn-secondary" type="button" onClick={() => setStatus('Pagada')}>
          Pagadas
        </button>
        <button className="btn-secondary" type="button" onClick={() => setStatus('Pendiente')}>
          Pendientes
        </button>
        <button className="btn-secondary" type="button" onClick={() => setStatus('')}>
          Todas
        </button>
        <button className="btn-primary" type="button" onClick={onNewInvoice}>
          + Nueva
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Vence</th>
              <th>Total</th>
              <th>Estado</th>
              <th style={{ width: '80px' }}>Acción</th>
            </tr>
          </thead>
          <tbody id="tabla-facturas">
            {filtered.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="7">No hay facturas registradas. Crea tu primera factura.</td>
              </tr>
            ) : (
              filtered.map((invoice) => {
                const badgeCls = invoice.status === 'Pagada' ? 'badge-paid' : 'badge-pending';
                return (
                  <tr key={invoice.id} data-estado={invoice.status}>
                    <td>{invoice.number}</td>
                    <td>{invoice.client}</td>
                    <td>{invoice.issuedAt}</td>
                    <td>{invoice.dueAt}</td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td><span className={`badge ${badgeCls}`}>{invoice.status}</span></td>
                    <td>
                      <button
                        className="btn-delete-row"
                        type="button"
                        onClick={() => setDeleteTarget(invoice)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Confirmar eliminación"
        text="¿Deseas eliminar esta factura?"
        detail={
          deleteTarget
            ? `${deleteTarget.number} — ${deleteTarget.client} — ${formatCurrency(deleteTarget.total)}`
            : '—'
        }
        confirmLabel="Sí, eliminar"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDeleteInvoice(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
