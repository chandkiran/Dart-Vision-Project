import {Routes,Route} from 'react-router-dom'
import RegistrationForm from './pages/forms.jsx'

function App(){
  return (
    <>
    <Routes>
    <Route path="/form" element={<RegistrationForm/>} />
    </Routes>
    </>
  )
}