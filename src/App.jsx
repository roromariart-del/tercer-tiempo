import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabase.js'
import Login from './pages/Login.jsx'
import CrearEquipo from './pages/CrearEquipo.jsx'

const C = {
  bg: '#060d06',
  card: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(34,139,34,0.25)',
  green: '#02550c',
  greenDim: 'rgba(46,204,64,0.12)',
  greenDark: '#0e7c2a',
  white: '#ffffff',
  gray: 'rgba(255,255,255,0.5)',
  red: '#630505',
  amber: '#ffaa00',
  glass: 'rgba(0,20,0,0.65)',
}

const headerBg = {
  background: "linear-gradient(180deg, rgba(6,13,6,0.2) 0%, rgba(6,13,6,0.6) 50%, #060d06 100%), url('/cancha.jpg') center/cover no-repeat",
}

function Home() {
  return (
    <div style={{background:C.bg, minHeight:'100vh'}}>
      {/* Hero */}
      <div style={{...headerBg, padding:'100px 16px 40px', textAlign:'center', position:'relative'}}>
        <p style={{fontSize:'11px',color:C.white,fontFamily:'Raleway',fontWeight:400,letterSpacing:'0.3em',margin:'0 0 4px'}}>BIENVENIDO</p>
        <h1 style={{fontSize:'52px',fontFamily:'Teko',fontWeight:700,color:C.white,letterSpacing:'3px',margin:'0 0 32px',lineHeight:1}}>TERCER TIEMPO</h1>

        {/* Próximo partido card */}
        <div style={{background:C.glass,backdropFilter:'blur(12px)',border:`1px solid ${C.cardBorder}`,borderRadius:'16px',padding:'18px',textAlign:'left'}}>
          <p style={{fontSize:'10px',color:C.green,fontFamily:'Raleway',fontWeight:400,letterSpacing:'0.2em',margin:'0 0 8px'}}>⚽ PRÓXIMO PARTIDO</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <p style={{fontSize:'26px',fontFamily:'Raleway',fontWeight:400,color:C.white,margin:'0 0 4px',letterSpacing:'1px'}}>TEAM COYOL</p>
              <p style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',margin:0}}>Dom 15 jun · 4:00pm · Alajuela</p>
            </div>
            <span style={{fontSize:'11px',padding:'5px 12px',borderRadius:'6px',background:C.green,color:'#000',fontFamily:'Raleway',fontWeight:700,letterSpacing:'0.1em'}}>ACEPTADO</span>
          </div>
        </div>
      </div>

      {/* Retos activos */}
      <div style={{padding:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
          <p style={{fontSize:'11px',color:C.gray,fontFamily:'Raleway',fontWeight:400,letterSpacing:'0.2em',textTransform:'uppercase',margin:0}}>Retos activos</p>
          <span style={{fontSize:'22px',cursor:'pointer'}}>🔔</span>
        </div>

        {[
          {ini:'LB', nombre:'Los Búfalos', fecha:'Sáb 14 jun · 8:00am', estado:'PENDIENTE', estadoColor:C.amber},
          {ini:'TC', nombre:'Team Coyol', fecha:'Dom 15 jun · 4:00pm', estado:'ACEPTADO', estadoColor:C.green},
        ].map(r => (
          <div key={r.nombre} style={{background:C.card,backdropFilter:'blur(8px)',border:`1px solid ${C.cardBorder}`,borderRadius:'12px',padding:'14px',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'42px',height:'42px',borderRadius:'8px',background:C.greenDim,border:`1px solid ${C.cardBorder}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontFamily:'Raleway',fontWeight:700,color:C.green}}>{r.ini}</div>
              <div>
                <p style={{fontSize:'17px',fontFamily:'Raleway',fontWeight:400,margin:0,color:C.white}}>{r.nombre}</p>
                <p style={{fontSize:'11px',color:C.gray,margin:0}}>{r.fecha}</p>
              </div>
            </div>
            <span style={{fontSize:'10px',padding:'4px 10px',borderRadius:'4px',border:`1px solid ${r.estadoColor}`,color:r.estadoColor,fontFamily:'Raleway',fontWeight:400,letterSpacing:'0.1em'}}>{r.estado}</span>
          </div>
        ))}

        <button style={{width:'100%',background:C.green,color:'#000',border:'none',borderRadius:'12px',padding:'16px',fontSize:'18px',fontFamily:'Teko',fontWeight:700,letterSpacing:'1px',cursor:'pointer',marginTop:'8px'}}>
          + LANZAR NUEVO RETO
        </button>
      </div>
    </div>
  )
}

function Retos({ usuario }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [retos, setRetos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevoReto, setNuevoReto] = useState({fecha:'', hora:'', zona:''})

  useEffect(() => {
    cargarRetos()
  }, [])

  const cargarRetos = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('retos')
      .select('*, equipos(nombre, zona)')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: false })
    if (!error) setRetos(data)
    setCargando(false)
  }

  const enviarReto = async () => {
    if (!nuevoReto.fecha || !nuevoReto.hora || !nuevoReto.zona) {
      alert('Completá todos los campos')
      return
    }
    const { error } = await supabase
      .from('retos')
      .insert([{
        fecha: nuevoReto.fecha,
        hora: nuevoReto.hora,
        zona: nuevoReto.zona,
        estado: 'pendiente',
        equipo_retador_id: null
      }])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setNuevoReto({fecha:'', hora:'', zona:''})
      setMostrarFormulario(false)
      cargarRetos()
    }
  }

  const responder = async (retoId, respuesta) => {
    const { error } = await supabase
      .from('reto_respuestas')
      .insert([{ reto_id: retoId, equipo_id: null, respuesta }])
    if (!error) {
      if (respuesta === 'aceptado') {
        await supabase.from('retos').update({ estado: 'aceptado' }).eq('id', retoId)
      }
      cargarRetos()
    }
  }

  return (
    <div style={{background:'#0d1117', minHeight:'100vh', padding:'24px 16px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h1 style={{fontSize:'42px', fontFamily:'Teko', fontWeight:700, color:'#ffffff', margin:0, letterSpacing:'2px'}}>RETOS</h1>
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={{background:'#2ecc40', color:'#000', border:'none', borderRadius:'8px', padding:'8px 18px', fontSize:'16px', fontFamily:'Teko', fontWeight:700, letterSpacing:'1px', cursor:'pointer'}}>+ NUEVO</button>
      </div>

      {mostrarFormulario && (
        <div style={{background:'rgba(0,20,0,0.6)', backdropFilter:'blur(12px)', border:'1px solid rgba(46,204,64,0.15)', borderRadius:'16px', padding:'18px', marginBottom:'16px'}}>
          <p style={{fontSize:'18px', fontFamily:'Teko', fontWeight:700, letterSpacing:'1px', marginBottom:'14px', color:'#ffffff'}}>LANZAR RETO</p>
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Fecha</p>
          <input type="date"
            value={nuevoReto.fecha}
            onChange={e => setNuevoReto({...nuevoReto, fecha:e.target.value})}
            style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.15)', marginBottom:'10px', fontSize:'13px', background:'rgba(255,255,255,0.05)', color:'#ffffff'}} />
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Hora</p>
          <input type="time"
            value={nuevoReto.hora}
            onChange={e => setNuevoReto({...nuevoReto, hora:e.target.value})}
            style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.15)', marginBottom:'10px', fontSize:'13px', background:'rgba(255,255,255,0.05)', color:'#ffffff'}} />
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Zona</p>
          <input type="text" placeholder="Ej: Heredia"
            value={nuevoReto.zona}
            onChange={e => setNuevoReto({...nuevoReto, zona:e.target.value})}
            style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.15)', marginBottom:'14px', fontSize:'13px', background:'rgba(255,255,255,0.05)', color:'#ffffff'}} />
          <button onClick={enviarReto} style={{width:'100%', background:'#2ecc40', color:'#000', border:'none', borderRadius:'8px', padding:'14px', fontSize:'18px', fontFamily:'Teko', fontWeight:700, letterSpacing:'1px', cursor:'pointer'}}>ENVIAR RETO ⚡</button>
        </div>
      )}

      <p style={{fontSize:'11px', color:'rgba(255,255,255,0.5)', fontFamily:'Teko', letterSpacing:'0.2em', marginBottom:'12px'}}>RETOS DISPONIBLES</p>

      {cargando ? (
        <p style={{color:'rgba(255,255,255,0.5)', textAlign:'center', fontFamily:'Teko', fontSize:'16px'}}>Cargando retos...</p>
      ) : retos.length === 0 ? (
        <p style={{color:'rgba(255,255,255,0.5)', textAlign:'center', fontFamily:'Teko', fontSize:'16px'}}>No hay retos pendientes</p>
      ) : retos.map(r => (
        <div key={r.id} style={{background:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)', border:'1px solid rgba(46,204,64,0.15)', borderRadius:'12px', padding:'16px', marginBottom:'8px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px'}}>
            <p style={{fontSize:'18px', fontFamily:'Raleway', fontWeight:400, margin:0, color:'#ffffff'}}>{r.equipos?.nombre || 'Equipo sin nombre'}</p>
            <span style={{fontSize:'10px', padding:'4px 10px', borderRadius:'4px', border:'1px solid #ffaa00', color:'#ffaa00', fontFamily:'Teko', letterSpacing:'0.1em'}}>PENDIENTE</span>
          </div>
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 14px'}}>📅 {r.fecha} · {r.hora} · 📍 {r.zona}</p>
          <div style={{display:'flex', gap:'8px'}}>
            <button onClick={() => responder(r.id, 'aceptado')} style={{flex:1, background:'#2ecc40', color:'#000', border:'none', borderRadius:'8px', padding:'10px', fontSize:'15px', fontFamily:'Teko', fontWeight:700, letterSpacing:'1px', cursor:'pointer'}}>✅ ACEPTAR</button>
            <button onClick={() => responder(r.id, 'rechazado')} style={{flex:1, background:'transparent', color:'#ff3b3b', border:'1px solid #ff3b3b', borderRadius:'8px', padding:'10px', fontSize:'15px', fontFamily:'Teko', fontWeight:700, letterSpacing:'1px', cursor:'pointer'}}>❌ RECHAZAR</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function MiEquipo() {
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [partidos, setPartidos] = useState([])
  const [nuevoPartido, setNuevoPartido] = useState({rival:'', golesA:'', golesB:''})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarPartidos()
  }, [])

  const cargarPartidos = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('partidos')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPartidos(data)
    setCargando(false)
  }

const registrar = async () => {
  if (!nuevoPartido.rival || nuevoPartido.golesA === '' || nuevoPartido.golesB === '') {
    alert('Completá todos los campos')
    return
  }
  const gA = parseInt(nuevoPartido.golesA)
  const gB = parseInt(nuevoPartido.golesB)
  const resultado = gA > gB ? 'ganado' : gA < gB ? 'perdido' : 'empate'
  const { data, error } = await supabase
    .from('partidos')
    .insert([{ rival: nuevoPartido.rival, goles_a: gA, goles_b: gB, resultado, equipo_id: null }])
    .select()
  if (error) {
    alert('Error: ' + error.message)
  } else {
    setNuevoPartido({rival:'', golesA:'', golesB:''})
    setMostrarRegistro(false)
    cargarPartidos()
  }
}

  const ganes = partidos.filter(p => p.resultado === 'ganado').length
  const empates = partidos.filter(p => p.resultado === 'empate').length
  const perdidos = partidos.filter(p => p.resultado === 'perdido').length

  return (
    <div style={{background:'#0d1117', minHeight:'100vh'}}>
      <div style={{...headerBg, padding:'48px 16px 32px'}}>
        <div style={{background:C.glass,backdropFilter:'blur(12px)',border:`1px solid ${C.cardBorder}`,borderRadius:'16px',padding:'20px',textAlign:'center'}}>
          <div style={{width:'64px',height:'64px',borderRadius:'12px',background:C.greenDim,border:`2px solid ${C.green}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontSize:'30px'}}>⚽</div>
          <p style={{fontSize:'28px',fontFamily:'Teko',fontWeight:700,color:C.white,margin:'0 0 4px',letterSpacing:'2px'}}>LOS CRACKS DE HEREDIA</p>
          <p style={{fontSize:'12px',color:C.gray,margin:0}}>Heredia · 8 jugadores</p>
        </div>
      </div>

      <div style={{padding:'16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'20px'}}>
          {[
            {label:'GANADOS', valor:ganes, color:C.green},
            {label:'EMPATES', valor:empates, color:C.amber},
            {label:'PERDIDOS', valor:perdidos, color:'#ff3b3b'},
          ].map(s => (
            <div key={s.label} style={{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:'12px',padding:'12px',textAlign:'center'}}>
              <p style={{fontSize:'28px',fontFamily:'Teko',fontWeight:700,color:s.color,margin:0,lineHeight:1}}>{s.valor}</p>
              <p style={{fontSize:'10px',color:C.gray,margin:'4px 0 0',fontFamily:'Teko',letterSpacing:'0.1em'}}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
          <p style={{fontSize:'11px',color:C.gray,fontFamily:'Teko',letterSpacing:'0.2em',margin:0}}>HISTORIAL DE PARTIDOS</p>
          <button onClick={() => setMostrarRegistro(!mostrarRegistro)} style={{background:C.green,color:'#000',border:'none',borderRadius:'8px',padding:'6px 14px',fontSize:'13px',fontFamily:'Teko',fontWeight:700,cursor:'pointer'}}>+ REGISTRAR</button>
        </div>

        {mostrarRegistro && (
          <div style={{background:C.glass,border:`1px solid ${C.cardBorder}`,borderRadius:'12px',padding:'16px',marginBottom:'12px'}}>
            <p style={{fontSize:'16px',fontFamily:'Teko',fontWeight:700,color:C.white,margin:'0 0 12px',letterSpacing:'1px'}}>REGISTRAR PARTIDO</p>
            <input type="text" placeholder="Nombre del rival"
              value={nuevoPartido.rival}
              onChange={e => setNuevoPartido({...nuevoPartido, rival:e.target.value})}
              style={{width:'100%',padding:'10px',borderRadius:'8px',border:`1px solid ${C.cardBorder}`,marginBottom:'8px',fontSize:'13px',background:'rgba(255,255,255,0.05)',color:C.white}}
            />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'12px'}}>
              <input type="number" placeholder="Tus goles"
                value={nuevoPartido.golesA}
                onChange={e => setNuevoPartido({...nuevoPartido, golesA:e.target.value})}
                style={{padding:'10px',borderRadius:'8px',border:`1px solid ${C.cardBorder}`,fontSize:'13px',background:'rgba(255,255,255,0.05)',color:C.white}}
              />
              <input type="number" placeholder="Goles rival"
                value={nuevoPartido.golesB}
                onChange={e => setNuevoPartido({...nuevoPartido, golesB:e.target.value})}
                style={{padding:'10px',borderRadius:'8px',border:`1px solid ${C.cardBorder}`,fontSize:'13px',background:'rgba(255,255,255,0.05)',color:C.white}}
              />
            </div>
            <button onClick={registrar} style={{width:'100%',background:C.green,color:'#000',border:'none',borderRadius:'8px',padding:'12px',fontSize:'16px',fontFamily:'Teko',fontWeight:700,cursor:'pointer',letterSpacing:'1px'}}>GUARDAR RESULTADO</button>
          </div>
        )}

        {cargando ? (
          <p style={{color:C.gray,textAlign:'center',fontFamily:'Teko',fontSize:'16px'}}>Cargando partidos...</p>
        ) : partidos.length === 0 ? (
          <p style={{color:C.gray,textAlign:'center',fontFamily:'Teko',fontSize:'16px'}}>No hay partidos registrados aún</p>
        ) : partidos.map((p, i) => (
          <div key={i} style={{background:C.card,border:`1px solid ${p.resultado==='ganado'?C.cardBorder:p.resultado==='perdido'?'rgba(255,59,59,0.2)':'rgba(255,170,0,0.2)'}`,borderRadius:'12px',padding:'14px',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <p style={{fontSize:'17px',fontFamily:'Raleway',fontWeight:400,color:C.white,margin:'0 0 2px'}}>{p.rival}</p>
              <p style={{fontSize:'11px',color:C.gray,margin:0}}>{new Date(p.fecha).toLocaleDateString('es-CR')}</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{fontSize:'24px',fontFamily:'Teko',fontWeight:700,color:p.resultado==='ganado'?C.green:p.resultado==='perdido'?'#ff3b3b':C.amber,margin:0,lineHeight:1}}>{p.goles_a} - {p.goles_b}</p>
              <p style={{fontSize:'10px',color:p.resultado==='ganado'?C.green:p.resultado==='perdido'?'#ff3b3b':C.amber,margin:'3px 0 0',fontFamily:'Teko',letterSpacing:'0.1em'}}>{p.resultado.toUpperCase()}</p>
            </div>
          </div>
        ))}

        <p style={{fontSize:'11px',color:C.gray,fontFamily:'Teko',letterSpacing:'0.2em',margin:'20px 0 12px'}}>INTEGRANTES</p>
        {[
          {ini:'CR', nombre:'Carlos Rojas', pos:'Portero · Capitán', capitan:true},
          {ini:'AM', nombre:'Andrés Mora', pos:'Delantero', capitan:false},
          {ini:'JS', nombre:'José Solano', pos:'Defensa', capitan:false},
        ].map(j => (
          <div key={j.nombre} style={{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:'12px',padding:'12px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'42px',height:'42px',borderRadius:'8px',background:C.greenDim,border:`1px solid ${C.cardBorder}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontFamily:'Teko',fontWeight:700,color:C.green,flexShrink:0}}>{j.ini}</div>
            <div style={{flex:1}}>
              <p style={{fontSize:'15px',fontFamily:'Raleway',fontWeight:400,margin:0,color:C.white}}>{j.nombre}</p>
              <p style={{fontSize:'11px',color:C.gray,margin:0}}>{j.pos}</p>
            </div>
            {j.capitan && <span style={{fontSize:'14px'}}>⭐</span>}
          </div>
        ))}

        <button style={{width:'100%',background:'transparent',color:C.green,border:`1px solid ${C.green}`,borderRadius:'12px',padding:'14px',fontSize:'18px',fontFamily:'Teko',fontWeight:700,cursor:'pointer',marginTop:'8px',letterSpacing:'1px'}}>+ AGREGAR JUGADOR</button>
      </div>
    </div>
  )
}

function Canchas() {
  const [canchas, setCanchas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarCanchas()
  }, [])

  const cargarCanchas = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('canchas')
      .select('*')
      .eq('activa', true)
    if (!error) setCanchas(data)
    setCargando(false)
  }

  const canchasFiltradas = canchas.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.zona.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{background:'#0d1117', minHeight:'100vh', padding:'24px 16px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
        <h1 style={{fontSize:'42px', fontFamily:'Teko', fontWeight:700, color:'#ffffff', margin:0, letterSpacing:'2px'}}>CANCHAS</h1>
        <span style={{fontSize:'20px', cursor:'pointer'}}>⚙️</span>
      </div>

      <div style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(46,204,64,0.15)', borderRadius:'12px', padding:'12px 14px', display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
        <span>🔍</span>
        <input
          type="text" placeholder="Buscar por zona o nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{background:'transparent', border:'none', outline:'none', fontSize:'13px', color:'#ffffff', width:'100%'}}
        />
      </div>

      {cargando ? (
        <p style={{color:'rgba(255,255,255,0.5)', textAlign:'center', fontFamily:'Teko', fontSize:'16px'}}>Cargando canchas...</p>
      ) : canchasFiltradas.length === 0 ? (
        <p style={{color:'rgba(255,255,255,0.5)', textAlign:'center', fontFamily:'Teko', fontSize:'16px'}}>No se encontraron canchas</p>
      ) : canchasFiltradas.map(c => (
        <div key={c.id} style={{background:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)', border:`1px solid ${c.activa ? 'rgba(46,204,64,0.2)' : 'rgba(255,59,59,0.15)'}`, borderRadius:'12px', padding:'16px', marginBottom:'8px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px'}}>
            <p style={{fontSize:'18px', fontFamily:'Teko', fontWeight:700, letterSpacing:'1px', margin:0, color:'#ffffff'}}>{c.nombre}</p>
            <span style={{fontSize:'10px', padding:'4px 10px', borderRadius:'4px', border:'1px solid #2ecc40', color:'#2ecc40', fontFamily:'Teko', letterSpacing:'0.1em'}}>DISPONIBLE</span>
          </div>
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 3px'}}>📍 {c.zona}</p>
          {c.telefono && <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 10px'}}>📞 {c.telefono}</p>}
          <button style={{background:'transparent', color:'#2ecc40', border:'1px solid #2ecc40', borderRadius:'8px', padding:'8px 16px', fontSize:'13px', fontFamily:'Teko', fontWeight:700, cursor:'pointer', letterSpacing:'0.5px'}}>VER DETALLES</button>
        </div>
      ))}
    </div>
  )
}

function NavBar() {
  const location = useLocation()
  const links = [
    {to:'/', icon:'🏠', label:'INICIO'},
    {to:'/retos', icon:'⚔️', label:'RETOS'},
    {to:'/equipo', icon:'👥', label:'EQUIPO'},
    {to:'/canchas', icon:'📍', label:'CANCHAS'},
  ]
  return (
    <nav style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:'480px',background:'rgba(6,13,6,0.95)',backdropFilter:'blur(12px)',borderTop:`1px solid ${C.cardBorder}`,display:'flex',justifyContent:'space-around',padding:'10px 0 14px'}}>
      {links.map(l => (
        <Link key={l.to} to={l.to} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',textDecoration:'none',color:location.pathname===l.to?C.green:'rgba(255,255,255,0.3)',flex:1}}>
          <span style={{fontSize:'20px'}}>{l.icon}</span>
          <span style={{fontSize:'9px',fontFamily:'Raleway',fontWeight:400,letterSpacing:'0.1em'}}>{l.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [equipo, setEquipo] = useState(null)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('usuario_tt')
    if (u) {
      const usuarioParsed = JSON.parse(u)
      setUsuario(usuarioParsed)
      cargarEquipo(usuarioParsed)
    } else {
      setVerificando(false)
    }
  }, [])

  const cargarEquipo = async (u) => {
    if (u.equipo_id) {
      const { data } = await supabase
        .from('equipos')
        .select('*, equipo_jugadores(*, usuarios(*))')
        .eq('id', u.equipo_id)
        .single()
      if (data) setEquipo(data)
    }
    setVerificando(false)
  }

  const handleLogin = (u) => {
    localStorage.setItem('usuario_tt', JSON.stringify(u))
    setUsuario(u)
    cargarEquipo(u)
  }

  const handleEquipoCreado = (e) => {
    setEquipo(e)
    const u = JSON.parse(localStorage.getItem('usuario_tt'))
    u.equipo_id = e.id
    localStorage.setItem('usuario_tt', JSON.stringify(u))
    setUsuario(u)
  }

  if (verificando) return (
    <div style={{background:'#060d06', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <p style={{color:'#2ecc40', fontFamily:'Teko', fontSize:'24px', letterSpacing:'2px'}}>CARGANDO...</p>
    </div>
  )

  if (!usuario) return <Login onLogin={handleLogin} />
  if (!usuario.equipo_id) return <CrearEquipo usuario={usuario} onEquipoCreado={handleEquipoCreado} />

  return (
    <BrowserRouter>
      <div style={{maxWidth:'480px', margin:'0 auto', minHeight:'100vh', background:C.bg, paddingBottom:'70px'}}>
        <Routes>
          <Route path="/" element={<Home usuario={usuario} equipo={equipo} />} />
          <Route path="/retos" element={<Retos usuario={usuario} equipo={equipo} />} />
          <Route path="/equipo" element={<MiEquipo usuario={usuario} equipo={equipo} onEquipoActualizado={setEquipo} />} />
          <Route path="/canchas" element={<Canchas />} />
        </Routes>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}