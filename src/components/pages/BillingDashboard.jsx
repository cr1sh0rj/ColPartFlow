import { formatCurrency } from '../../utils/formatters';

export default function BillingDashboard({ invoices, onNewInvoice }) {
  const totalSales = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const issuedCount = invoices.length;
  const pendingTotal = invoices
    .filter((invoice) => invoice.status === 'Pendiente')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const cancelled = invoices.filter((invoice) => invoice.status === 'Cancelada').length;
  const recent = invoices.slice(0, 5);

  return (
    <>
      <div className="page-header">
        <div className="page-title">Panel de facturación</div>
        <div className="page-sub">Resumen de ventas — mayo 2026</div>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Ventas del mes</div>
          <div className="metric-value">{formatCurrency(totalSales)}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {issuedCount === 0 ? 'Sin registros aún' : 'Actualizado'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Facturas emitidas</div>
          <div className="metric-value">{issuedCount}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {issuedCount === 0 ? 'Sin registros aún' : 'En seguimiento'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Por cobrar</div>
          <div className="metric-value">{formatCurrency(pendingTotal)}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {pendingTotal === 0 ? 'Sin pendientes' : 'Pendiente'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Canceladas</div>
          <div className="metric-value">{cancelled}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {cancelled === 0 ? 'Sin registros' : 'Revisión'}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Facturas recientes</div>
          <button className="btn-primary" type="button" onClick={onNewInvoice}>
            + Nueva factura
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="5">No hay facturas aún. Crea tu primera factura.</td>
              </tr>
            ) : (
              recent.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.number}</td>
                  <td>{invoice.client}</td>
                  <td>{invoice.issuedAt}</td>
                  <td>{formatCurrency(invoice.total)}</td>
                  <td>{invoice.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
