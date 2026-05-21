import { useMemo, useState } from 'react';

export default function NewInvoicePage({ products, onEmitInvoice, formatCurrency }) {
  const [client, setClient] = useState('');
  const [nit, setNit] = useState('');
  const [date, setDate] = useState('');
  const [payment, setPayment] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [qtyByCode, setQtyByCode] = useState({});
  const [lineItems, setLineItems] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const lines = useMemo(() => Object.values(lineItems), [lineItems]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
    const ivaTotal = lines.reduce(
      (sum, line) => sum + line.quantity * line.price * (line.iva / 100),
      0,
    );
    return {
      subtotal,
      ivaTotal,
      total: subtotal + ivaTotal,
    };
  }, [lines]);

  const handleAddLine = (product) => {
    const qty = parseInt(qtyByCode[product.code], 10) || 1;
    if (product.stock <= 0) {
      window.alert('Este producto no tiene stock disponible.');
      return;
    }
    if (qty < 1 || qty > product.stock) {
      window.alert(`Cantidad inválida. Stock disponible: ${product.stock}`);
      return;
    }

    setLineItems((prev) => ({
      ...prev,
      [product.code]: {
        code: product.code,
        name: product.name,
        quantity: qty,
        price: product.cost,
        iva: prev[product.code]?.iva ?? 19,
      },
    }));
  };

  const handleQtyInput = (code, value) => {
    setQtyByCode((prev) => ({ ...prev, [code]: value }));
    if (lineItems[code]) {
      const qty = parseInt(value, 10);
      const product = products.find((item) => item.code === code);
      if (!Number.isNaN(qty) && qty > 0 && (!product || qty <= product.stock)) {
        setLineItems((prev) => ({
          ...prev,
          [code]: { ...prev[code], quantity: qty },
        }));
      }
    }
  };

  const handleChangeIva = (code, value) => {
    setLineItems((prev) => ({
      ...prev,
      [code]: { ...prev[code], iva: parseInt(value, 10) },
    }));
  };

  const handleRemoveLine = (code) => {
    setLineItems((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  };

  const handleReset = () => {
    setClient('');
    setNit('');
    setDate('');
    setPayment('');
    setError('');
    setQtyByCode({});
    setLineItems({});
  };

  const handleEmit = () => {
    if (!client || !date || !payment) {
      setError('Complete los campos: cliente, fecha y condición de pago.');
      return;
    }
    if (lines.length === 0) {
      setError('Selecciona al menos un producto del inventario.');
      return;
    }
    setError('');

    onEmitInvoice({
      client,
      date,
      payment,
      lines,
    });

    handleReset();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Nueva factura</div>
        <div className="page-sub">Selecciona los productos del inventario y la cantidad</div>
      </div>

      <div className="success-banner" id="fac-success" style={{ display: showSuccess ? 'block' : 'none' }}>
        Factura emitida. El stock fue actualizado en inventario.
      </div>

      <div
        className="fac-two-col"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        <div className="table-card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
              letterSpacing: '.04em',
              textTransform: 'uppercase',
            }}
          >
            Datos del cliente
          </div>

          <div className="form-field" style={{ marginBottom: '.75rem' }}>
            <label className="field-label" htmlFor="fac-cliente">Cliente *</label>
            <input
              className="field-input"
              id="fac-cliente"
              type="text"
              placeholder="Nombre del cliente..."
              value={client}
              onChange={(event) => setClient(event.target.value)}
            />
          </div>
          <div className="form-field" style={{ marginBottom: '.75rem' }}>
            <label className="field-label" htmlFor="fac-nit">NIT cliente</label>
            <input
              className="field-input"
              id="fac-nit"
              type="text"
              placeholder="000.000.000-0"
              value={nit}
              onChange={(event) => setNit(event.target.value)}
            />
          </div>
          <div className="form-field" style={{ marginBottom: '.75rem' }}>
            <label className="field-label" htmlFor="fac-fecha">Fecha emisión *</label>
            <input
              className="field-input"
              id="fac-fecha"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="form-field" style={{ marginBottom: '1rem' }}>
            <label className="field-label" htmlFor="fac-pago">Condición de pago *</label>
            <select
              className="field-select"
              id="fac-pago"
              value={payment}
              onChange={(event) => setPayment(event.target.value)}
            >
              <option value="">Seleccionar...</option>
              <option>Contado</option>
              <option>15 días</option>
              <option>30 días</option>
              <option>45 días</option>
            </select>
          </div>

          <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: '1rem' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '.75rem',
                letterSpacing: '.04em',
                textTransform: 'uppercase',
              }}
            >
              Resumen
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Subtotal
                <span id="fac-subtotal" style={{ color: 'var(--color-text-primary)' }}>
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                IVA
                <span id="fac-iva-total" style={{ color: 'var(--color-text-primary)' }}>
                  {formatCurrency(totals.ivaTotal)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  borderTop: '0.5px solid var(--color-border-tertiary)',
                  paddingTop: '8px',
                  marginTop: '4px',
                }}
              >
                Total
                <span id="fac-total" style={{ color: '#c9a84c' }}>
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          </div>

          <div id="fac-error" style={{ fontSize: '12px', color: '#e24b4a', minHeight: '16px', marginTop: '10px' }}>
            {error}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button className="btn-secondary" style={{ flex: 1 }} type="button" onClick={handleReset}>
              Limpiar
            </button>
            <button className="btn-primary" style={{ flex: 2 }} type="button" onClick={handleEmit}>
              Emitir factura
            </button>
          </div>
        </div>

        <div className="table-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '.04em',
                textTransform: 'uppercase',
              }}
            >
              Productos en inventario
            </div>
            <input
              className="search-input"
              type="text"
              id="buscador-fac-prod"
              placeholder="Buscar..."
              style={{ width: '160px' }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div
              id="fac-prod-empty"
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              No hay productos en inventario. Agrega productos primero.
            </div>
          ) : (
            <table id="tabla-fac-productos" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody id="fac-prod-list">
                {filteredProducts.map((product) => (
                  <tr key={product.code} data-nombre={product.name}>
                    <td style={{ fontSize: '12px' }}>
                      {product.name}
                      <br />
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                        {product.code}
                      </span>
                    </td>
                    <td
                      style={{
                        fontSize: '13px',
                        color: product.stock === 0 ? '#e24b4a' : product.stock < 50 ? '#c9a84c' : '#5aab78',
                      }}
                    >
                      {product.stock}
                    </td>
                    <td style={{ fontSize: '13px' }}>{formatCurrency(product.cost)}</td>
                    <td>
                      <input
                        className="field-input"
                        type="number"
                        min="1"
                        max={product.stock}
                        placeholder="0"
                        style={{ width: '65px' }}
                        value={qtyByCode[product.code] || ''}
                        onChange={(event) => handleQtyInput(product.code, event.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        type="button"
                        onClick={() => handleAddLine(product)}
                      >
                        + Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', marginTop: '1rem', paddingTop: '1rem' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '.75rem',
                letterSpacing: '.04em',
                textTransform: 'uppercase',
              }}
            >
              Líneas seleccionadas
            </div>
            {lines.length === 0 ? (
              <div id="fac-lineas-empty" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Ningún producto seleccionado aún.
              </div>
            ) : (
              <table id="tabla-lineas-sel" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio unit.</th>
                    <th>IVA</th>
                    <th>Total línea</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody id="lineas-factura">
                  {lines.map((line) => {
                    const base = line.quantity * line.price;
                    const iva = base * (line.iva / 100);
                    const total = base + iva;
                    return (
                      <tr key={line.code}>
                        <td style={{ fontSize: '12px' }}>{line.name}</td>
                        <td style={{ fontSize: '13px' }}>{line.quantity}</td>
                        <td style={{ fontSize: '13px' }}>{formatCurrency(line.price)}</td>
                        <td>
                          <select
                            className="field-select"
                            style={{ width: '70px' }}
                            value={line.iva}
                            onChange={(event) => handleChangeIva(line.code, event.target.value)}
                          >
                            <option value="0">0%</option>
                            <option value="19">19%</option>
                          </select>
                        </td>
                        <td style={{ color: '#c9a84c', fontWeight: 500, fontSize: '13px' }}>
                          {formatCurrency(total)}
                        </td>
                        <td>
                          <button
                            className="btn-delete-row"
                            type="button"
                            onClick={() => handleRemoveLine(line.code)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
