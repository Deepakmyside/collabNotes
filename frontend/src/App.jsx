import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" />
}

function App() {
  return (
    <BrowserRouter>
           <Routes>
                 <Route path="/" element={<Login/>} />
                 <Route path="/dashboard" element={
                  <PrivateRoute>
                       <Dashboard />
                  </PrivateRoute>
                 }  />
                 <Route path="/editor/:roomId" element={
                  <PrivateRoute>
                     <Editor/>
                  </PrivateRoute>
                 }  />
           </Routes>
    </BrowserRouter>
  )
}

export default App