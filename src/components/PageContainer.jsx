export default function PageContainer({ id, active, children }) {
  return (
    <div id={`page-${id}`} className={`page ${active ? 'active' : ''}`}>
      {children}
    </div>
  );
}
