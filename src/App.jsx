import { Header } from './components/layout/Header';
import { Main } from './components/layout/Main';
import { ServiceDashboard } from './components/services/ServiceDashboard';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Main>
        <ServiceDashboard />
      </Main>
    </>
  );
}

export default App;
