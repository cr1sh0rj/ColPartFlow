export default function AlertsPage({ products }) {
  const alerts = products.filter(
    (product) => product.stock === 0 || (product.minStock > 0 && product.stock <= product.minStock),
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">Alertas de stock</div>
        <div className="page-sub">Productos que requieren reabastecimiento</div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Stock crítico y agotado</div>
          <button className="btn-primary" type="button">Generar orden</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock actual</th>
              <th>Mínimo</th>
              <th>Alerta</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="6">Sin alertas activas. El stock está en buen estado.</td>
              </tr>
            ) : (
              alerts.map((product) => {
                const alertText = product.stock === 0 ? 'Agotado' : 'Stock bajo';
                return (
                  <tr key={product.code}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock} {product.unit}</td>
                    <td>{product.minStock}</td>
                    <td>{alertText}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
