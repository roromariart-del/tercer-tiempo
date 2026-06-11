import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function CrearEquipo({ usuario, onEquipoCreado }) {
  const [nombre, setNombre] = useState('')
  const [zona, setZona] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const crear = async () => {
    if (!nombre) {
      setError('Poné un nombre al equipo')
      return
    }
    setCargando(true)
    setError('')

    const { data: equipo, error: errorEquipo } = await supabase
      .from('equipos')
      .insert([{ nombre, zona, capitan_id: usuario.id }])
      .select()
      .single()

    if (errorEquipo) {
      setError('Error: ' + errorEquipo.message)
      setCargando(false)
      return
    }

    await supabase
      .from('equipo_jugadores')
      .insert([{ equipo_id: equipo.id, usuario_id: usuario.id, posicion: 'Capitán', es_capitan: true }])

    await supabase
      .from('usuarios')
      .update({ equipo_id: equipo.id })
      .eq('id', usuario.id)

    onEquipoCreado(equipo)
    setCargando(false)
  }

  return (
    <div style={{background:'#060d06', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'24px'}}>
      <div style={{textAlign:'center', marginBottom:'40px'}}>
        <p style={{fontSize:'13px', color:'#2ecc40', fontFamily:'Teko', fontWeight:700, letterSpacing:'0.3em', margin:'0 0 8px'}}>CREÁ TU</p>
        <h1 style={{fontSize:'52px', fontFamily:'Teko', fontWeight:700, color:'#ffffff', letterSpacing:'3px', margin:0, lineHeight:1}}>EQUIPO</h1>
      </div>

      <div style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(46,204,64,0.2)', borderRadius:'16px', padding:'24px'}}>
        <p style={{fontSize:'18px', fontFamily:'Teko', fontWeight:700, color:'#ffffff', margin:'0 0 20px', letterSpacing:'1px'}}>DATOS DEL EQUIPO</p>

        <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Nombre del equipo</p>
        <input
          type="text" placeholder="Ej: Los Cracks de Heredia"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.2)', marginBottom:'14px', fontSize:'14px', background:'rgba(255,255,255,0.05)', color:'#fff'}}
        />

        <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>Zona</p>
        <input
          type="text" placeholder="Ej: Heredia, Alajuela..."
          value={zona}
          onChange={e => setZona(e.target.value)}
          style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.2)', marginBottom:'20px', fontSize:'14px', background:'rgba(255,255,255,0.05)', color:'#fff'}}
        />

        {error && <p style={{color:'#ff3b3b', fontSize:'13px', margin:'0 0 12px'}}>{error}</p>}

        <button onClick={crear} disabled={cargando} style={{width:'100%', background:'#2ecc40', color:'#000', border:'none', borderRadius:'12px', padding:'16px', fontSize:'20px', fontFamily:'Teko', fontWeight:700, cursor:'pointer', letterSpacing:'1px'}}>
          {cargando ? 'CREANDO...' : 'CREAR EQUIPO ⚽'}
        </button>
      </div>
    </div>
  )
}