import { useMemo, useState } from 'react';
import ProductModal from '../modals/ProductModal';
import ConfirmModal from '../modals/ConfirmModal';

export default function ProductsPage({ products, onAddProduct, onDeleteProduct, formatCurrency }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesText = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = !category || product.category === category;
      return matchesText && matchesCat;
    });
  }, [products, search, category]);

  const handleSave = (product) => {
    onAddProduct(product);
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteProduct(deleteTarget.code);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Productos</div>
        <div className="page-sub">Gestión de artículos en inventario</div>
      </div>

      <div className="success-banner" id="prod-success" style={{ display: showSuccess ? 'block' : 'none' }}>
        Producto registrado correctamente.
      </div>

      <div className="actions-row">
        <input
          className="search-input"
          type="text"
          id="buscador"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="field-select"
          id="filtro-cat"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{ width: '160px', padding: '8px 12px', fontSize: '13px' }}
        >
          <option value="">Todas las categorías</option>
          <option>Filtros</option>
          <option>Aceites</option>
          <option>Repuestos</option>
        </select>
        <button className="btn-primary" type="button" onClick={() => setShowModal(true)}>
          + Nuevo producto
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Costo unit.</th>
              <th>Estado</th>
              <th style={{ width: '80px' }}>Acción</th>
            </tr>
          </thead>
          <tbody id="tabla-productos">
            {filtered.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="7">
                  No hay productos registrados. Agrega tu primer producto.
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const isOut = product.stock === 0;
                const isLow = product.minStock > 0 && product.stock <= product.minStock;
                const badgeClass = isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-ok';
                const badgeText = isOut ? 'Agotado' : isLow ? 'Stock bajo' : 'Normal';

                return (
                  <tr key={product.code} data-cat={product.category} data-minimo={product.minStock}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock} {product.unit}</td>
                    <td>{formatCurrency(product.cost)}</td>
                    <td><span className={`badge ${badgeClass}`}>{badgeText}</span></td>
                    <td>
                      <button
                        className="btn-delete-row"
                        type="button"
                        onClick={() => setDeleteTarget(product)}
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

      <ProductModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Confirmar eliminación"
        text="¿Deseas eliminar este producto del inventario?"
        detail={
          deleteTarget
            ? `${deleteTarget.code} — ${deleteTarget.name} — Stock: ${deleteTarget.stock} ${deleteTarget.unit}`
            : '—'
        }
        confirmLabel="Sí, eliminar"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
