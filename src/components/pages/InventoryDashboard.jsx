import { formatCurrency } from '../../utils/formatters';

export default function InventoryDashboard({ products, movements }) {
  const totalProducts = products.length;
  const stockValue = products.reduce(
    (sum, product) => sum + product.stock * product.cost,
    0,
  );
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const lowStock = products.filter(
    (product) =>
      product.stock > 0 &&
      product.minStock > 0 &&
      product.stock <= product.minStock,
  ).length;
  const recent = movements.slice(0, 5);

  return (
    <>
      <div className="page-header">
        <div className="page-title">Panel de inventario</div>
        <div className="page-sub">Resumen general del stock — mayo 2026</div>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Total productos</div>
          <div className="metric-value">{totalProducts}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {totalProducts === 0 ? 'Sin registros aún' : 'Inventario activo'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Valor en stock</div>
          <div className="metric-value">{formatCurrency(stockValue)}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {totalProducts === 0 ? 'Sin registros aún' : 'Actualizado'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Stock bajo</div>
          <div className="metric-value">{lowStock}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {lowStock === 0 ? 'Sin alertas' : 'Requiere atención'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Sin stock</div>
          <div className="metric-value">{outOfStock}</div>
          <div className="metric-change" style={{ color: '#6b8299' }}>
            {outOfStock === 0 ? 'Sin alertas' : 'Acción inmediata'}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Últimos movimientos</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Referencia</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="6">
                  No hay movimientos aún. Comienza registrando entradas de inventario.
                </td>
              </tr>
            ) : (
              recent.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.date}</td>
                  <td>{movement.responsible}</td>
                  <td>{movement.category}</td>
                  <td>{movement.type}</td>
                  <td>{movement.quantity}</td>
                  <td>Registrado</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
