import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>RetaGol</h1>
        <span className="bell">🔔</span>
      </div>

      <div className="section">
        <h2>Retos activos</h2>
        <div className="reto-card">
          <div className="reto-info">
            <div className="avatar">LB</div>
            <div>
              <p className="reto-nombre">Los Búfalos</p>
              <p className="reto-fecha">Sáb 14 jun · 8:00am</p>
            </div>
          </div>
          <span className="badge pendiente">Pendiente</span>
        </div>
        <div className="reto-card">
          <div className="reto-info">
            <div className="avatar azul">TC</div>
            <div>
              <p className="reto-nombre">Team Coyol</p>
              <p className="reto-fecha">Dom 15 jun · 4:00pm</p>
            </div>
          </div>
          <span className="badge aceptado">Aceptado</span>
        </div>
      </div>

      <button className="btn-primary">+ Lanzar nuevo reto</button>
    </div>
  )
}