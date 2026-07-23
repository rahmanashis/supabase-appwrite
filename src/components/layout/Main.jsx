import './Main.css';

export function Main({ children }) {
  return (
    <main className="main" id="main-content">
      <div className="container main__container">{children}</div>
    </main>
  );
}
