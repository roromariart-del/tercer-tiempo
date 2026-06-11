import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

export default function AdminCanchas() {
  const [canchas, setCanchas] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nueva, setNueva] = useState({nombre:'', zona:'', telefono:'', lat:'', lng:''})
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarCanchas()
  }, [])

  const cargarCanchas = async () => {
    const { data } = await supabase.from('canchas').select('*').order('created_at', { ascending: false })
    if (data) setCanchas(data)
  }

  const agregar = async () => {
    if (!nueva.nombre || !nueva.zona) {
      alert('Nombre y zona son obligatorios')
      return
    }
    setCargando(true)
    const { error } = await supabase
      .from('canchas')
      .insert([{ nombre: nueva.nombre, zona: nueva.zona, telefono: nueva.telefono, lat: parseFloat(nueva.lat) || null, lng: parseFloat(nueva.lng) || null, activa: true }])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setNueva({nombre:'', zona:'', telefono:'', lat:'', lng:''})
      setMostrarForm(false)
      cargarCanchas()
    }
    setCargando(false)
  }

  const toggleActiva = async (id, activa) => {
    await supabase.from('canchas').update({ activa: !activa }).eq('id', id)
    cargarCanchas()
  }

  return (
    <div style={{background:'#060d06', minHeight:'100vh', padding:'24px 16px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <div>
          <p style={{fontSize:'11px', color:'#2ecc40', fontFamily:'Teko', letterSpacing:'0.2em', margin:'0 0 2px'}}>PANEL ADMIN</p>
          <h1 style={{fontSize:'36px', fontFamily:'Teko', fontWeight:700, color:'#fff', margin:0, letterSpacing:'2px'}}>CANCHAS</h1>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{background:'#2ecc40', color:'#000', border:'none', borderRadius:'8px', padding:'8px 18px', fontSize:'16px', fontFamily:'Teko', fontWeight:700, cursor:'pointer'}}>+ NUEVA</button>
      </div>

      {mostrarForm && (
        <div style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(46,204,64,0.2)', borderRadius:'16px', padding:'20px', marginBottom:'20px'}}>
          <p style={{fontSize:'18px', fontFamily:'Teko', fontWeight:700, color:'#fff', margin:'0 0 16px', letterSpacing:'1px'}}>AGREGAR CANCHA</p>

          {[
            {label:'Nombre de la cancha', key:'nombre', placeholder:'Ej: Cancha El Llano'},
            {label:'Zona', key:'zona', placeholder:'Ej: Heredia Centro'},
            {label:'Teléfono', key:'telefono', placeholder:'Ej: 8888-1234'},
            {label:'Latitud (opcional)', key:'lat', placeholder:'Ej: 9.9981'},
            {label:'Longitud (opcional)', key:'lng', placeholder:'Ej: -84.1170'},
          ].map(f => (
            <div key={f.key}>
              <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 6px'}}>{f.label}</p>
              <input
                type="text" placeholder={f.placeholder}
                value={nueva[f.key]}
                onChange={e => setNueva({...nueva, [f.key]: e.target.value})}
                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid rgba(46,204,64,0.2)', marginBottom:'12px', fontSize:'13px', background:'rgba(255,255,255,0.05)', color:'#fff'}}
              />
            </div>
          ))}

          <button onClick={agregar} disabled={cargando} style={{width:'100%', background:'#2ecc40', color:'#000', border:'none', borderRadius:'8px', padding:'12px', fontSize:'18px', fontFamily:'Teko', fontWeight:700, cursor:'pointer', letterSpacing:'1px'}}>
            {cargando ? 'GUARDANDO...' : 'GUARDAR CANCHA'}
          </button>
        </div>
      )}

      {canchas.map(c => (
        <div key={c.id} style={{background:'rgba(255,255,255,0.05)', border:`1px solid ${c.activa ? 'rgba(46,204,64,0.2)' : 'rgba(255,59,59,0.2)'}`, borderRadius:'12px', padding:'14px', marginBottom:'8px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px'}}>
            <p style={{fontSize:'18px', fontFamily:'Teko', fontWeight:700, color:'#fff', margin:0, letterSpacing:'1px'}}>{c.nombre}</p>
            <button onClick={() => toggleActiva(c.id, c.activa)} style={{background:c.activa ? 'rgba(255,59,59,0.2)' : 'rgba(46,204,64,0.2)', color: c.activa ? '#ff3b3b' : '#2ecc40', border:`1px solid ${c.activa ? '#ff3b3b' : '#2ecc40'}`, borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontFamily:'Teko', cursor:'pointer'}}>
              {c.activa ? 'DESACTIVAR' : 'ACTIVAR'}
            </button>
          </div>
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:'0 0 3px'}}>📍 {c.zona}</p>
          {c.telefono && <p style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:0}}>📞 {c.telefono}</p>}
        </div>
      ))}
    </div>
  )
}