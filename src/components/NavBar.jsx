import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const location = useLocation()

  return (
    <nav style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:'480px',background:'#fff',borderTop:'1px solid #e5e5e5',display:'flex',justifyContent:'space-around',padding:'8px 0 12px',zIndex:100}}>
      <Link to="/" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',textDecoration:'none',color:location.pathname==='/'?'#1a5c2a':'#999',flex:1}}>
        <span style={{fontSize:'20px'}}>🏠</span>
        <span style={{fontSize:'10px',fontWeight:500}}>Inicio</span>
      </Link>
      <Link to="/retos" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',textDecoration:'none',color:location.pathname==='/retos'?'#1a5c2a':'#999',flex:1}}>
        <span style={{fontSize:'20px'}}>⚔️</span>
        <span style={{fontSize:'10px',fontWeight:500}}>Retos</span>
      </Link>
      <Link to="/equipo" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',textDecoration:'none',color:location.pathname==='/equipo'?'#1a5c2a':'#999',flex:1}}>
        <span style={{fontSize:'20px'}}>👥</span>
        <span style={{fontSize:'10px',fontWeight:500}}>Mi equipo</span>
      </Link>
      <Link to="/canchas" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',textDecoration:'none',color:location.pathname==='/canchas'?'#1a5c2a':'#999',flex:1}}>
        <span style={{fontSize:'20px'}}>📍</span>
        <span style={{fontSize:'10px',fontWeight:500}}>Canchas</span>
      </Link>
    </nav>
  )
}