export default function ClientsPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-title">Clientes</div>
        <div className="page-sub">Directorio de clientes registrados</div>
      </div>

      <div className="actions-row">
        <input className="search-input" type="text" placeholder="Buscar cliente..." />
        <button className="btn-primary" type="button">+ Nuevo cliente</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>NIT</th>
              <th>Razón social</th>
              <th>Ciudad</th>
              <th>Contacto</th>
              <th>Facturas</th>
            </tr>
          </thead>
          <tbody>
            <tr className="empty-row">
              <td colSpan="5">No hay clientes registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
