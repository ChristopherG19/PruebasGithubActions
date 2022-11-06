import React from 'react'
import { Link } from 'react-router-dom'
import ThemeCard from './components/ThemeCard'
import Logo from '../images/logo-negative.png'
import themes from '../utils/purchasedThemesGetter'
import '../styles/ThemesPage.css'

const MyThemes = () => (
    <>
      <header>
        <h2>Tus temas</h2>
      </header>
      <aside>
        <img src={Logo} alt="Logo de Kodonote" />
        <input
          type="text"
          name="theme-search-bar"
          id="theme-search-bar"
          className="theme-search-bar"
          placeholder="Buscar tema"
        />
        <Link to="/themes" className="theme-aside-button">Comprar temas</Link>
        <Link to="/main" className="theme-aside-button">Volver</Link>
      </aside>
      <main className="themes-main">
        {themes.map((availableTheme) => (
          <ThemeCard
            availableTheme={availableTheme}
            usable
          />
        ))}
      </main>
    </>
  )

export default MyThemes