import { useMemo, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainLayout from './components/MainLayout';
import './styles/app.css';
import './styles/responsive.css';
import {
  formatCurrency,
  formatDate,
  formatDateShort,
  parseLocalDate,
} from './utils/formatters';

const LOGIN_PASSWORDS = {
  inventario: 'inv123',
  facturacion: 'fac123',
};

const getDefaultUser = (role) =>
  role === 'inventario' ? 'Jefe de Inventario' : 'Facturador';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [role, setRole] = useState('inventario');
  const [userName, setUserName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activePage, setActivePage] = useState('dashboard-inv');

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceCounter, setInvoiceCounter] = useState(1);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.code, product])),
    [products],
  );

  const handleSelectRole = (nextRole) => {
    setRole(nextRole);
    setLoginError('');
  };

  const handleLogin = ({ user, pass }) => {
    if (!pass) {
      setLoginError('Por favor ingrese su clave de acceso.');
      return;
    }
    if (pass !== LOGIN_PASSWORDS[role]) {
      setLoginError('Clave incorrecta. Verifique e intente de nuevo.');
      return;
    }

    setLoginError('');
    setScreen('main');
    const name = user?.trim() || getDefaultUser(role);
    setUserName(name);
    setActivePage(role === 'inventario' ? 'dashboard-inv' : 'dashboard-fac');
  };

  const handleLogout = () => {
    setScreen('login');
    setRole('inventario');
    setUserName('');
    setLoginError('');
    setActivePage('dashboard-inv');
  };

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleDeleteProduct = (code) => {
    setProducts((prev) => prev.filter((product) => product.code !== code));
  };

  const handleAddMovement = (movement) => {
    setMovements((prev) => [movement, ...prev]);
  };

  const handleDeleteMovement = (id) => {
    setMovements((prev) => prev.filter((movement) => movement.id !== id));
  };

  const handleDeleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
  };

  const handleEmitInvoice = ({ client, date, payment, lines }) => {
    const issuedAt = parseLocalDate(date);
    const dueDate = issuedAt ? new Date(issuedAt) : null;
    if (dueDate) {
      dueDate.setDate(dueDate.getDate() + 15);
    }

    const subtotal = lines.reduce(
      (sum, line) => sum + line.quantity * line.price,
      0,
    );
    const ivaTotal = lines.reduce(
      (sum, line) => sum + line.quantity * line.price * (line.iva / 100),
      0,
    );
    const total = subtotal + ivaTotal;

    const status = payment === 'Contado' ? 'Pagada' : 'Pendiente';
    const number = `FV-${String(invoiceCounter).padStart(4, '0')}`;
    setInvoiceCounter((prev) => prev + 1);

    setInvoices((prev) => [
      {
        id: number,
        number,
        client,
        issuedAt: formatDateShort(issuedAt),
        dueAt: formatDateShort(dueDate),
        total,
        status,
      },
      ...prev,
    ]);

    setProducts((prev) =>
      prev.map((product) => {
        const line = lines.find((item) => item.code === product.code);
        if (!line) return product;
        const nextStock = Math.max(0, product.stock - line.quantity);
        return { ...product, stock: nextStock };
      }),
    );

    const movementEntries = lines.map((line) => {
      const product = productMap.get(line.code);
      const unit = product?.unit || 'und';
      return {
        id: `${Date.now()}-${Math.random()}`,
        date: formatDate(issuedAt),
        type: 'Salida',
        product: line.name,
        category: product?.category || '',
        quantity: `-${line.quantity} ${unit}`,
        responsible: `Factura ${client}`,
      };
    });
    setMovements((prev) => [...movementEntries, ...prev]);
  };

  return (
    <div className="app">
      {screen === 'login' ? (
        <LoginScreen
          role={role}
          error={loginError}
          onSelectRole={handleSelectRole}
          onLogin={handleLogin}
        />
      ) : (
        <MainLayout
          role={role}
          userName={userName}
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={handleLogout}
          products={products}
          movements={movements}
          invoices={invoices}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddMovement={handleAddMovement}
          onDeleteMovement={handleDeleteMovement}
          onDeleteInvoice={handleDeleteInvoice}
          onEmitInvoice={handleEmitInvoice}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}
