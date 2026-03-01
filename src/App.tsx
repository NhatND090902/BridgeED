import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout, AuthLayout } from './layouts';
import {
  Dashboard,
  EmotionTracker,
  GraceModule,
  ValueJournal,
  GraceLibrary,
  AnonymousChat,
  About,
  Login,
  Register,
} from './pages';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/emotion-tracker" element={<EmotionTracker />} />
          <Route path="/value-journal" element={<ValueJournal />} />
          <Route path="/grace-module" element={<GraceModule />} />
          <Route path="/grace-library" element={<GraceLibrary />} />
          <Route path="/anonymous-chat" element={<AnonymousChat />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Auth Layout Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
