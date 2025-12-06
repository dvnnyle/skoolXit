import './customMenu.css'
import logo from '../../assets/day17logo.png'

function CustomMenu() {
  return (
    <div className="logo-container">
      <div className="logo-background"></div>
      <img src={logo} alt="Day17 Logo" className="logo" />
    </div>
  )
}

export default CustomMenu