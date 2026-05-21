export default function SalesReportPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-title">Reporte de ventas</div>
        <div className="page-sub">Análisis de facturación por período</div>
      </div>

      <div className="metrics-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-label">Total acumulado</div>
          <div className="metric-value">$0</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>Sin registros aún</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Promedio mensual</div>
          <div className="metric-value">$0</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>Sin registros aún</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Mejor mes</div>
          <div className="metric-value">—</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>Sin datos</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Ventas por mes</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Facturas</th>
              <th>Ventas brutas</th>
              <th>IVA</th>
              <th>Total neto</th>
            </tr>
          </thead>
          <tbody>
            <tr className="empty-row">
              <td colSpan="5">No hay datos de ventas. Comienza emitiendo facturas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
