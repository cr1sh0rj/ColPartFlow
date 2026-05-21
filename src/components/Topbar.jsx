export default function Topbar({
  initials,
  userName,
  roleLabel,
  onLogout,
  onToggleSidebar,
}) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="hamburger"
          id="hamburger-btn"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="topbar-brand">ColPartFlow</div>
      </div>
      <div className="topbar-user">
        <div className="user-badge" id="user-initials">{initials}</div>
        <div>
          <div className="user-name" id="user-name-display">{userName}</div>
          <div className="user-role" id="user-role-display">{roleLabel}</div>
        </div>
        <button className="btn-logout" type="button" onClick={onLogout}>
          Salir
        </button>
      </div>
    </div>
  );
}
