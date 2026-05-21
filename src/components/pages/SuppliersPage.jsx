export default function SuppliersPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-title">Proveedores</div>
        <div className="page-sub">Directorio de proveedores registrados</div>
      </div>

      <div className="actions-row">
        <input className="search-input" type="text" placeholder="Buscar proveedor..." />
        <button className="btn-primary" type="button">+ Nuevo proveedor</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>NIT</th>
              <th>Proveedor</th>
              <th>Especialidad</th>
              <th>Contacto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="empty-row">
              <td colSpan="5">No hay proveedores registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
