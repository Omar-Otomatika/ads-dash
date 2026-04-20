import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './features/auth/components/SignInPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
