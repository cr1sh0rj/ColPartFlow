const NAV_SECTIONS = {
  inventario: [
    {
      label: 'Principal',
      items: [{ id: 'dashboard-inv', label: 'Panel general' }],
    },
    {
      label: 'Inventario',
      items: [
        { id: 'productos', label: 'Productos' },
        { id: 'movimientos', label: 'Movimientos' },
        { id: 'proveedores', label: 'Proveedores' },
      ],
    },
    {
      label: 'Reportes',
      items: [{ id: 'alertas', label: 'Alertas de stock' }],
    },
  ],
  facturacion: [
    {
      label: 'Principal',
      items: [{ id: 'dashboard-fac', label: 'Panel general' }],
    },
    {
      label: 'Facturación',
      items: [
        { id: 'facturas', label: 'Facturas' },
        { id: 'nueva-factura', label: 'Nueva factura' },
        { id: 'clientes', label: 'Clientes' },
      ],
    },
    {
      label: 'Reportes',
      items: [{ id: 'ventas-rep', label: 'Reporte de ventas' }],
    },
  ],
};

export default function Sidebar({
  role,
  activePage,
  isOpen,
  isVisible,
  onNavigate,
}) {
  const sections = NAV_SECTIONS[role];
  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''}`}
      id={`sidebar-${role === 'inventario' ? 'inv' : 'fac'}`}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      {sections.map((section) => (
        <div key={section.label}>
          <div className="nav-section-label">{section.label}</div>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onNavigate(item.id);
                }
              }}
            >
              <span className="nav-dot"></span>
              {item.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
