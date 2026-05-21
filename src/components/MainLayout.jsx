import { useMemo, useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import PageContainer from './PageContainer';
import InventoryDashboard from './pages/InventoryDashboard';
import ProductsPage from './pages/ProductsPage';
import MovementsPage from './pages/MovementsPage';
import SuppliersPage from './pages/SuppliersPage';
import AlertsPage from './pages/AlertsPage';
import BillingDashboard from './pages/BillingDashboard';
import InvoicesPage from './pages/InvoicesPage';
import NewInvoicePage from './pages/NewInvoicePage';
import ClientsPage from './pages/ClientsPage';
import SalesReportPage from './pages/SalesReportPage';

export default function MainLayout({
  role,
  userName,
  activePage,
  onNavigate,
  onLogout,
  products,
  movements,
  invoices,
  onAddProduct,
  onDeleteProduct,
  onAddMovement,
  onDeleteMovement,
  onDeleteInvoice,
  onEmitInvoice,
  formatCurrency,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = useMemo(() => {
    if (!userName) return 'IN';
    return userName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [userName]);

  const roleLabel = role === 'inventario'
    ? 'Módulo Inventario'
    : 'Módulo Facturación';

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div id="main-screen" className="screen active">
      <div className="main-app" id="app-wrapper">
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          id="sidebar-overlay"
          onClick={handleCloseSidebar}
        />

        <Topbar
          initials={initials}
          userName={userName || 'Usuario'}
          roleLabel={roleLabel}
          onLogout={onLogout}
          onToggleSidebar={handleToggleSidebar}
        />

        <div className="layout">
          <Sidebar
            role="inventario"
            activePage={activePage}
            isOpen={sidebarOpen && role === 'inventario'}
            isVisible={role === 'inventario'}
            onNavigate={handleNavigate}
          />
          <Sidebar
            role="facturacion"
            activePage={activePage}
            isOpen={sidebarOpen && role === 'facturacion'}
            isVisible={role === 'facturacion'}
            onNavigate={handleNavigate}
          />

          <div className="content">
            <PageContainer id="dashboard-inv" active={activePage === 'dashboard-inv'}>
              <InventoryDashboard products={products} movements={movements} />
            </PageContainer>

            <PageContainer id="productos" active={activePage === 'productos'}>
              <ProductsPage
                products={products}
                onAddProduct={onAddProduct}
                onDeleteProduct={onDeleteProduct}
                formatCurrency={formatCurrency}
              />
            </PageContainer>

            <PageContainer id="movimientos" active={activePage === 'movimientos'}>
              <MovementsPage
                movements={movements}
                onAddMovement={onAddMovement}
                onDeleteMovement={onDeleteMovement}
              />
            </PageContainer>

            <PageContainer id="proveedores" active={activePage === 'proveedores'}>
              <SuppliersPage />
            </PageContainer>

            <PageContainer id="alertas" active={activePage === 'alertas'}>
              <AlertsPage products={products} />
            </PageContainer>

            <PageContainer id="dashboard-fac" active={activePage === 'dashboard-fac'}>
              <BillingDashboard
                invoices={invoices}
                onNewInvoice={() => handleNavigate('nueva-factura')}
              />
            </PageContainer>

            <PageContainer id="facturas" active={activePage === 'facturas'}>
              <InvoicesPage
                invoices={invoices}
                onNewInvoice={() => handleNavigate('nueva-factura')}
                onDeleteInvoice={onDeleteInvoice}
              />
            </PageContainer>

            <PageContainer id="nueva-factura" active={activePage === 'nueva-factura'}>
              <NewInvoicePage
                products={products}
                onEmitInvoice={onEmitInvoice}
                formatCurrency={formatCurrency}
              />
            </PageContainer>

            <PageContainer id="clientes" active={activePage === 'clientes'}>
              <ClientsPage />
            </PageContainer>

            <PageContainer id="ventas-rep" active={activePage === 'ventas-rep'}>
              <SalesReportPage />
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
