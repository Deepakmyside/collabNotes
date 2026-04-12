import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    localStorage.setItem('redirectAfterLogin', window.location.pathname)
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/" element={<Login/>}/>
        <Route path="/editor/:roomId" element={
          <PrivateRoute>
            <Editor/>
          </PrivateRoute>
        }/>
     <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App