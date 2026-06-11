import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [zona, setZona] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const entrar = async () => {
    if (!nombre || !telefono) {
      setError('Completá tu nombre y teléfono')
      return
    }
    setCargando(true)
    setError('')
    try {
      const { data: existente } = await supabase
        .from('usuarios')
        .select('*')
        .eq('telefono', telefono)
        .maybeSingle()
      if (existente) {
        onLogin(existente)
      } else {
        const { data, error } = await supabase
          .from('usuarios')
          .insert([{ nombre, telefono, zona }])
          .select()
          .single()
        if (error) {
          setError('Error al registrarse: ' + error.message)
        } else {
          onLogin(data)
        }
      }
    } catch(e) {
      setError('Error de conexión: ' + e.message)
    }
    setCargando(false)
  }

  return (
    <div style={{background:'#060d06', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'24px'}}>
      <div style={{textAlign:'center', marginBottom:'40px'}}>
        <p style={{fontSize:'13px', color:'#2ecc40', fontFamily:'Teko', fontWeight:700, letterSpacing:'0.3em', margin:'0 0 8px'}}>BIENVENIDO A</p>
        <h1 style={{fontSize:'56px', fontFamily:'Teko', fontWeight:700, color:'#ffffff', letterSpacing:'3px', margin:0, lineHeight:1}}>TERCER TIEMPO</h1>
      </div>

      <div style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(46,204,64,0.2)', borderRadius:'16px', padding:'24px'}}>
        <p style={{fontSize:'18px', fontFamily:'Teko', fontWeight:700, color:'#ffffff', margin:'0 0 20px', letterSpacing:'1px'}}>INGRESÁ TUS DATOS</p>

        <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Nombre</p>
        <input type="text" placeholder="Tu nombre"
          value={nombre} onChange={e => setNombre(e.target.value)}
          style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.2)', marginBottom:'14px', fontSize:'14px', background:'rgba(255,255,255,0.05)', color:'#fff'}}
        />

        <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Número de teléfono</p>
        <input type="tel" placeholder="8888-8888"
          value={telefono} onChange={e => setTelefono(e.target.value)}
          style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.2)', marginBottom:'14px', fontSize:'14px', background:'rgba(255,255,255,0.05)', color:'#fff'}}
        />

        <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Zona (opcional)</p>
        <input type="text" placeholder="Ej: Heredia, Alajuela..."
          value={zona} onChange={e => setZona(e.target.value)}
          style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.2)', marginBottom:'20px', fontSize:'14px', background:'rgba(255,255,255,0.05)', color:'#fff'}}
        />

        {error && <p style={{color:'#ff3b3b', fontSize:'13px', margin:'0 0 12px'}}>{error}</p>}

        <button onClick={entrar} disabled={cargando} style={{width:'100%', background:'#2ecc40', color:'#000', border:'none', borderRadius:'12px', padding:'16px', fontSize:'20px', fontFamily:'Teko', fontWeight:700, cursor:'pointer', letterSpacing:'1px'}}>
          {cargando ? 'CARGANDO...' : 'ENTRAR ⚽'}
        </button>
      </div>
    </div>
  )
}