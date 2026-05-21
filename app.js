/* ---------- Estado global ---------- */
let currentRole       = 'inventario';
let filaABorrar       = null;
let filaABorrarProducto = null;
let filaABorrarFactura  = null;
let contadorFactura   = 1;
let lineasFactura     = [];
let lineasMap         = {};

/* ============================================================
   LOGIN
   ============================================================ */
function selectRole(role) {
  currentRole = role;
  document.getElementById('tab-inv').classList.toggle('selected', role === 'inventario');
  document.getElementById('tab-fac').classList.toggle('selected', role === 'facturacion');
}

function doLogin() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const err  = document.getElementById('login-error');

  if (!pass) {
    err.textContent = 'Por favor ingrese su clave de acceso.';
    return;
  }
  if (currentRole === 'inventario' && pass === 'inv123') {
    launchApp('inventario', user || 'Jefe de Inventario');
  } else if (currentRole === 'facturacion' && pass === 'fac123') {
    launchApp('facturacion', user || 'Facturador');
  } else {
    err.textContent = 'Clave incorrecta. Verifique e intente de nuevo.';
  }
}

function launchApp(role, name) {
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('main-screen').classList.add('active');

  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('user-initials').textContent    = initials || 'IN';
  document.getElementById('user-name-display').textContent = name;
  document.getElementById('user-role-display').textContent =
    role === 'inventario' ? 'Módulo Inventario' : 'Módulo Facturación';

  if (role === 'inventario') {
    document.getElementById('sidebar-inv').style.display = 'block';
    document.getElementById('sidebar-fac').style.display = 'none';
    showPage('dashboard-inv', null);
  } else {
    document.getElementById('sidebar-fac').style.display = 'block';
    document.getElementById('sidebar-inv').style.display = 'none';
    showPage('dashboard-fac', null);
    agregarLineaFactura();
  }
}

function doLogout() {
  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').textContent = '';
  selectRole('inventario');
}

/* ============================================================
   NAVEGACIÓN
   ============================================================ */
function showPage(pageId, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');

  if (pageId === 'nueva-factura') {
    lineasMap = {};
    renderLineasSeleccionadas();
    calcularTotalesFac();
    setTimeout(cargarProductosEnFactura, 50);
  }
}

/* ============================================================
   MODALES — utilidad
   ============================================================ */
function cerrarModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* ============================================================
   INVENTARIO: Productos
   ============================================================ */
function filtrarProductos() {
  const txt = document.getElementById('buscador').value.toLowerCase();
  const cat = document.getElementById('filtro-cat').value;
  document.querySelectorAll('#tabla-productos tr').forEach(row => {
    const nombre = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
    const rowCat = row.getAttribute('data-cat') || '';
    row.style.display = (nombre.includes(txt) && (!cat || rowCat === cat)) ? '' : 'none';
  });
}

function abrirModal() {
  document.getElementById('modal-producto').classList.add('open');
  ['np-codigo', 'np-nombre', 'np-stock', 'np-costo', 'np-minimo']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('np-categoria').value = '';
  document.getElementById('modal-error').textContent = '';
}

function guardarProducto() {
  const codigo   = document.getElementById('np-codigo').value.trim();
  const nombre   = document.getElementById('np-nombre').value.trim();
  const stock    = document.getElementById('np-stock').value.trim();
  const costo    = document.getElementById('np-costo').value.trim();
  const cat      = document.getElementById('np-categoria').value;
  const unidad   = document.getElementById('np-unidad').value.split(' ')[0];
  const minimo   = parseInt(document.getElementById('np-minimo').value) || 0;
  const err      = document.getElementById('modal-error');

  if (!codigo || !nombre || !cat || stock === '' || costo === '') {
    err.textContent = 'Complete todos los campos obligatorios.';
    return;
  }
  err.textContent = '';

  const s = parseInt(stock);
  const estadoBadge = s === 0
    ? '<span class="badge badge-out">Agotado</span>'
    : (minimo > 0 && s <= minimo)
      ? '<span class="badge badge-low">Stock bajo</span>'
      : '<span class="badge badge-ok">Normal</span>';

  // Quitar fila vacía si existe
  const tbody = document.getElementById('tabla-productos');
  const emptyRow = tbody.querySelector('.empty-row');
  if (emptyRow) emptyRow.remove();

  const fila = document.createElement('tr');
  fila.setAttribute('data-cat', cat);
  fila.setAttribute('data-minimo', minimo);
  fila.innerHTML = `
    <td>${codigo}</td>
    <td>${nombre}</td>
    <td>${cat}</td>
    <td>${s} ${unidad}</td>
    <td>$${parseInt(costo).toLocaleString('es-CO')}</td>
    <td>${estadoBadge}</td>
    <td><button class="btn-delete-row" onclick="confirmarBorrarProducto(this)">Borrar</button></td>
  `;
  tbody.appendChild(fila);
  cerrarModal('modal-producto');

  const banner = document.getElementById('prod-success');
  banner.style.display = 'block';
  setTimeout(() => { banner.style.display = 'none'; }, 3000);
}

function confirmarBorrarProducto(btn) {
  filaABorrarProducto = btn.closest('tr');
  const c = filaABorrarProducto.querySelectorAll('td');
  document.getElementById('borrar-producto-detalle').textContent =
    `${c[0].textContent} — ${c[1].textContent} — Stock: ${c[3].textContent}`;
  document.getElementById('modal-borrar-producto').classList.add('open');
}

function ejecutarBorradoProducto() {
  if (filaABorrarProducto) {
    filaABorrarProducto.remove();
    filaABorrarProducto = null;
  }
  cerrarModal('modal-borrar-producto');
}

/* ============================================================
   INVENTARIO: Movimientos
   ============================================================ */
function abrirModalMovimiento() {
  document.getElementById('modal-movimiento').classList.add('open');
  ['mov-producto', 'mov-cantidad', 'mov-responsable']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('mov-tipo').value      = '';
  document.getElementById('mov-categoria').value = '';
  document.getElementById('mov-fecha').value     = new Date().toISOString().split('T')[0];
  document.getElementById('mov-error').textContent = '';
}

function guardarMovimiento() {
  const tipo        = document.getElementById('mov-tipo').value;
  const fecha       = document.getElementById('mov-fecha').value;
  const producto    = document.getElementById('mov-producto').value.trim();
  const cat         = document.getElementById('mov-categoria').value;
  const cantidad    = document.getElementById('mov-cantidad').value.trim();
  const responsable = document.getElementById('mov-responsable').value.trim();
  const err         = document.getElementById('mov-error');

  if (!tipo || !fecha || !producto || !cat || !cantidad || !responsable) {
    err.textContent = 'Complete todos los campos.';
    return;
  }
  err.textContent = '';

  const d = new Date(fecha + 'T12:00:00');
  const fechaStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  const cantStr  = tipo === 'Entrada' ? `+${cantidad} und` : `-${cantidad} und`;

  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${fechaStr}</td>
    <td>${tipo}</td>
    <td>${producto}</td>
    <td>${cat}</td>
    <td>${cantStr}</td>
    <td>${responsable}</td>
    <td><button class="btn-delete-row" onclick="confirmarBorrar(this)">Borrar</button></td>
  `;
  const tbody = document.getElementById('tabla-movimientos');
  const emptyRow = tbody.querySelector('.empty-row');
  if (emptyRow) emptyRow.remove();
  tbody.insertBefore(fila, tbody.firstChild);
  cerrarModal('modal-movimiento');
}

function filtrarMovimientos() {
  const txt = document.getElementById('buscador-mov').value.toLowerCase();
  document.querySelectorAll('#tabla-movimientos tr').forEach(row => {
    const prod = row.cells[2] ? row.cells[2].textContent.toLowerCase() : '';
    row.style.display = prod.includes(txt) ? '' : 'none';
  });
}

function filtrarMovTipo(tipo) {
  document.querySelectorAll('#tabla-movimientos tr').forEach(row => {
    const t = row.cells[1] ? row.cells[1].textContent : '';
    row.style.display = (!tipo || t === tipo) ? '' : 'none';
  });
}

function confirmarBorrar(btn) {
  filaABorrar = btn.closest('tr');
  const c = filaABorrar.querySelectorAll('td');
  document.getElementById('borrar-detalle').textContent =
    `${c[0].textContent} — ${c[2].textContent} — ${c[3].textContent} — ${c[4].textContent} — Responsable: ${c[5].textContent}`;
  document.getElementById('modal-borrar').classList.add('open');
}

function ejecutarBorrado() {
  if (filaABorrar) {
    filaABorrar.remove();
    filaABorrar = null;
    const tbody = document.getElementById('tabla-movimientos');
    if (tbody.querySelectorAll('tr').length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No hay movimientos registrados.</td></tr>';
    }
  }
  cerrarModal('modal-borrar');
}

/* ============================================================
   FACTURACIÓN: Nueva factura — carga de productos
   ============================================================ */
function cargarProductosEnFactura() {
  const tbody = document.getElementById('fac-prod-list');
  if (!tbody) return;
  tbody.innerHTML = '';

  const filas = document.querySelectorAll('#tabla-productos tr');
  const productosValidos = Array.from(filas).filter(
    tr => tr.cells.length >= 5 && !tr.classList.contains('empty-row')
  );

  const empty = document.getElementById('fac-prod-empty');
  const tabla = document.getElementById('tabla-fac-productos');

  if (productosValidos.length === 0) {
    if (empty) empty.style.display = 'block';
    if (tabla) tabla.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (tabla) tabla.style.display = '';

  productosValidos.forEach((tr, idx) => {
    const codigo   = tr.cells[0].textContent.trim();
    const nombre   = tr.cells[1].textContent.trim();
    const cat      = tr.cells[2].textContent.trim();
    const stockNum = parseInt(tr.cells[3].textContent) || 0;
    const precio   = parseInt(tr.cells[4].textContent.replace(/[^0-9]/g, '')) || 0;

    const row = document.createElement('tr');
    row.setAttribute('data-codigo', codigo);
    row.setAttribute('data-nombre', nombre);
    row.setAttribute('data-stock',  stockNum);
    row.setAttribute('data-precio', precio);
    row.setAttribute('data-cat',    cat);
    row.innerHTML = `
      <td style="font-size:12px;">
        ${nombre}<br>
        <span style="color:var(--color-text-secondary);font-size:11px;">${codigo}</span>
      </td>
      <td id="stock-disp-${idx}" style="font-size:13px; color:${stockNum===0?'#e24b4a':stockNum<50?'#c9a84c':'#5aab78'};">
        ${stockNum}
      </td>
      <td style="font-size:13px;">$${precio.toLocaleString('es-CO')}</td>
      <td>
        <input
          class="field-input"
          type="number"
          min="1"
          max="${stockNum}"
          placeholder="0"
          style="width:65px;"
          id="qty-prod-${idx}"
          oninput="actualizarCantidadLinea('${codigo}', ${idx})"
        />
      </td>
      <td>
        <button
          class="btn-secondary"
          style="padding:4px 10px; font-size:11px;"
          onclick="agregarProdAFactura(${idx})"
        >+ Add</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function filtrarProdsFac() {
  const txt = document.getElementById('buscador-fac-prod').value.toLowerCase();
  document.querySelectorAll('#fac-prod-list tr').forEach(tr => {
    const nom = tr.getAttribute('data-nombre') || '';
    tr.style.display = nom.toLowerCase().includes(txt) ? '' : 'none';
  });
}

/* ============================================================
   FACTURACIÓN: Nueva factura — líneas
   ============================================================ */
function agregarProdAFactura(idx) {
  const tr = document.querySelector(`#fac-prod-list tr:nth-child(${idx + 1})`);
  if (!tr) return;

  const codigo   = tr.getAttribute('data-codigo');
  const nombre   = tr.getAttribute('data-nombre');
  const stock    = parseInt(tr.getAttribute('data-stock')) || 0;
  const precio   = parseInt(tr.getAttribute('data-precio')) || 0;
  const qtyInput = document.getElementById('qty-prod-' + idx);
  const qty      = parseInt(qtyInput?.value) || 1;

  if (stock <= 0) { alert('Este producto no tiene stock disponible.'); return; }
  if (qty < 1 || qty > stock) { alert(`Cantidad inválida. Stock disponible: ${stock}`); return; }

  if (lineasMap[codigo]) {
    lineasMap[codigo].cantidad = qty;
  } else {
    lineasMap[codigo] = { nombre, cantidad: qty, precio, ivaPorc: 19, trIndex: idx };
  }
  renderLineasSeleccionadas();
  calcularTotalesFac();
}

function actualizarCantidadLinea(codigo, idx) {
  if (!lineasMap[codigo]) return;
  const tr    = document.querySelector(`#fac-prod-list tr:nth-child(${idx + 1})`);
  const stock = parseInt(tr?.getAttribute('data-stock')) || 0;
  const qty   = parseInt(document.getElementById('qty-prod-' + idx)?.value) || 0;
  if (qty > 0 && qty <= stock) {
    lineasMap[codigo].cantidad = qty;
    renderLineasSeleccionadas();
    calcularTotalesFac();
  }
}

function renderLineasSeleccionadas() {
  const tbody = document.getElementById('lineas-factura');
  const empty = document.getElementById('fac-lineas-empty');
  const tabla = document.getElementById('tabla-lineas-sel');
  tbody.innerHTML = '';

  const keys = Object.keys(lineasMap);
  if (keys.length === 0) {
    if (empty) empty.style.display = 'block';
    if (tabla) tabla.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (tabla) tabla.style.display = '';

  keys.forEach(codigo => {
    const l     = lineasMap[codigo];
    const base  = l.cantidad * l.precio;
    const iva   = base * (l.ivaPorc / 100);
    const total = base + iva;
    const tr    = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:12px;">${l.nombre}</td>
      <td style="font-size:13px;">${l.cantidad}</td>
      <td style="font-size:13px;">$${l.precio.toLocaleString('es-CO')}</td>
      <td>
        <select class="field-select" style="width:70px;" onchange="cambiarIvaLinea('${codigo}', this.value)">
          <option value="0"  ${l.ivaPorc === 0  ? 'selected' : ''}>0%</option>
          <option value="19" ${l.ivaPorc === 19 ? 'selected' : ''}>19%</option>
        </select>
      </td>
      <td style="color:#c9a84c; font-weight:500; font-size:13px;">$${Math.round(total).toLocaleString('es-CO')}</td>
      <td><button class="btn-delete-row" onclick="quitarLineaFac('${codigo}')">✕</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function cambiarIvaLinea(codigo, val) {
  if (lineasMap[codigo]) {
    lineasMap[codigo].ivaPorc = parseInt(val);
    renderLineasSeleccionadas();
    calcularTotalesFac();
  }
}

function quitarLineaFac(codigo) {
  delete lineasMap[codigo];
  renderLineasSeleccionadas();
  calcularTotalesFac();
}

function calcularTotalesFac() {
  let subtotal = 0, ivaTotal = 0;
  Object.values(lineasMap).forEach(l => {
    const base = l.cantidad * l.precio;
    subtotal  += base;
    ivaTotal  += base * (l.ivaPorc / 100);
  });
  document.getElementById('fac-subtotal').textContent  = '$' + Math.round(subtotal).toLocaleString('es-CO');
  document.getElementById('fac-iva-total').textContent = '$' + Math.round(ivaTotal).toLocaleString('es-CO');
  document.getElementById('fac-total').textContent     = '$' + Math.round(subtotal + ivaTotal).toLocaleString('es-CO');
}

function limpiarNuevaFactura() {
  ['fac-cliente', 'fac-nit'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('fac-fecha').value        = '';
  document.getElementById('fac-pago').value         = '';
  document.getElementById('fac-error').textContent  = '';
  lineasMap = {};
  renderLineasSeleccionadas();
  calcularTotalesFac();
  cargarProductosEnFactura();
}

function emitirFactura() {
  const cliente = document.getElementById('fac-cliente').value.trim();
  const fecha   = document.getElementById('fac-fecha').value;
  const pago    = document.getElementById('fac-pago').value;
  const err     = document.getElementById('fac-error');

  if (!cliente || !fecha || !pago) {
    err.textContent = 'Complete los campos: cliente, fecha y condición de pago.';
    return;
  }
  if (Object.keys(lineasMap).length === 0) {
    err.textContent = 'Selecciona al menos un producto del inventario.';
    return;
  }
  err.textContent = '';

  // Descontar stock y registrar movimientos automáticos
  Object.keys(lineasMap).forEach(codigo => {
    const l = lineasMap[codigo];
    document.querySelectorAll('#tabla-productos tr').forEach(tr => {
      if (tr.cells[0] && tr.cells[0].textContent.trim() === codigo) {
        const stockCell = tr.cells[3];
        const unidad    = stockCell.textContent.replace(/[0-9]/g, '').trim();
        const actual    = parseInt(stockCell.textContent) || 0;
        const nuevo     = Math.max(0, actual - l.cantidad);
        stockCell.textContent = nuevo + ' ' + unidad;

        // Actualizar badge de estado usando el mínimo guardado en el tr
        if (tr.cells[5]) {
          const minTr = parseInt(tr.getAttribute('data-minimo')) || 0;
          tr.cells[5].innerHTML = nuevo === 0
            ? '<span class="badge badge-out">Agotado</span>'
            : (minTr > 0 && nuevo <= minTr)
              ? '<span class="badge badge-low">Stock bajo</span>'
              : '<span class="badge badge-ok">Normal</span>';
        }

        // Registrar movimiento automático
        const d = new Date(fecha + 'T12:00:00');
        const fechaStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${fechaStr}</td>
          <td>Salida</td>
          <td>${l.nombre}</td>
          <td>${tr.cells[2]?.textContent || ''}</td>
          <td>-${l.cantidad} und</td>
          <td>Factura ${cliente}</td>
          <td><button class="btn-delete-row" onclick="confirmarBorrar(this)">Borrar</button></td>
        `;
        const tbody   = document.getElementById('tabla-movimientos');
        const emptyRow = tbody.querySelector('.empty-row');
        if (emptyRow) emptyRow.remove();
        tbody.insertBefore(fila, tbody.firstChild);
      }
    });
  });

  // Registrar factura en la tabla
  const total  = document.getElementById('fac-total').textContent;
  const d      = new Date(fecha + 'T12:00:00');
  const dv     = new Date(d);
  dv.setDate(dv.getDate() + 15);
  const fmt    = dt => `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}`;
  const estado = pago === 'Contado' ? 'Pagada' : 'Pendiente';
  const badgeCls = estado === 'Pagada' ? 'badge-paid' : 'badge-pending';
  const num    = 'FV-' + String(contadorFactura).padStart(4, '0');
  contadorFactura++;

  const fila = document.createElement('tr');
  fila.setAttribute('data-estado', estado);
  fila.innerHTML = `
    <td>${num}</td>
    <td>${cliente}</td>
    <td>${fmt(d)}</td>
    <td>${fmt(dv)}</td>
    <td>${total}</td>
    <td><span class="badge ${badgeCls}">${estado}</span></td>
    <td><button class="btn-delete-row" onclick="confirmarBorrarFactura(this)">Borrar</button></td>
  `;
  const tablaFac = document.getElementById('tabla-facturas');
  const emptyFac = tablaFac.querySelector('.empty-row');
  if (emptyFac) emptyFac.remove();
  tablaFac.insertBefore(fila, tablaFac.firstChild);

  const banner = document.getElementById('fac-success');
  banner.style.display = 'block';
  setTimeout(() => { banner.style.display = 'none'; }, 4000);
  limpiarNuevaFactura();
}

/* ============================================================
   FACTURACIÓN: Facturas
   ============================================================ */
function confirmarBorrarFactura(btn) {
  filaABorrarFactura = btn.closest('tr');
  const c = filaABorrarFactura.querySelectorAll('td');
  document.getElementById('borrar-factura-detalle').textContent =
    `${c[0].textContent} — ${c[1].textContent} — ${c[4].textContent}`;
  document.getElementById('modal-borrar-factura').classList.add('open');
}

function ejecutarBorradoFactura() {
  if (filaABorrarFactura) {
    filaABorrarFactura.remove();
    filaABorrarFactura = null;
  }
  cerrarModal('modal-borrar-factura');
}

function filtrarFacturas() {
  const txt = document.getElementById('buscador-fac').value.toLowerCase();
  document.querySelectorAll('#tabla-facturas tr').forEach(row => {
    const num = row.cells[0]?.textContent.toLowerCase() || '';
    const cli = row.cells[1]?.textContent.toLowerCase() || '';
    row.style.display = (num.includes(txt) || cli.includes(txt)) ? '' : 'none';
  });
}

function filtrarFacturaEstado(estado) {
  document.querySelectorAll('#tabla-facturas tr').forEach(row => {
    const e = row.getAttribute('data-estado') || '';
    row.style.display = (!estado || e === estado) ? '' : 'none';
  });
}

/* ============================================================
   EVENTOS GLOBALES
   ============================================================ */
document.getElementById('login-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

/* ============================================================
   SIDEBAR MÓVIL
   ============================================================ */
function toggleSidebar() {
  const sidebars = document.querySelectorAll('.sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const isOpen   = [...sidebars].some(s => s.classList.contains('open'));
  sidebars.forEach(s => {
    if (s.style.display !== 'none') {
      s.classList.toggle('open', !isOpen);
    }
  });
  overlay.classList.toggle('open', !isOpen);
}

function closeSidebar() {
  document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('open'));
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// Cerrar sidebar al navegar (mobile UX)
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});
