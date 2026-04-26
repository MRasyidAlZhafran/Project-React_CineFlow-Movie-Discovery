import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Star, Play, Info } from 'lucide-react'

function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [featuredMovie, setFeaturedMovie] = useState(null)
  
  // Ambil keyword dari URL
  const queryParam = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(queryParam)

  useEffect(() => {
    if (queryParam) {
      fetchMovies(queryParam)
    } else {
      fetchMovies('marvel')
    }
  }, [queryParam])

  const fetchMovies = async (query) => {
    try {
      setLoading(true)
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
      const data = await response.json()
      
      const transformedData = data.map(item => ({
        id: item.show.id,
        title: item.show.name,
        poster: item.show.image?.original || 'https://via.placeholder.com/600x900?text=No+Poster',
        rating: item.show.rating?.average || null,
        year: item.show.premiered?.split('-')[0] || 'TBA',
        plot: item.show.summary?.replace(/<[^>]*>/g, '') || 'No description available.',
        watchLink: item.show.officialSite || `https://www.youtube.com/results?search_query=${item.show.name}+official+trailer`
      }))

      if (transformedData.length > 0 && !queryParam) {
        setFeaturedMovie(transformedData[0])
      }
      setMovies(transformedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching movies:', error)
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Sinkronisasi input dengan URL
    if (value.length > 2) {
      setSearchParams({ q: value })
    } else if (value === '') {
      setSearchParams({})
    }
  }

  const handleWatchNow = (e, link) => {
    e.preventDefault()
    e.stopPropagation()
    if (link) {
      window.open(link, '_blank')
    }
  }

  const btnPrimary = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'var(--transition)',
    textDecoration: 'none'
  }

  const btnSecondary = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: 'var(--glass)',
    color: 'white',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'var(--transition)',
    textDecoration: 'none'
  }

  return (
    <div className="home-page">
      <nav>
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="logo">
              CINE<span>FLOW</span>
            </Link>
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search movies or shows..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </nav>

      {loading && movies.length === 0 ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          {featuredMovie && !queryParam && (
            <header className="hero">
              <div className="hero-bg">
                <img src={featuredMovie.poster} alt={featuredMovie.title} />
              </div>
              <div className="container">
                <div className="hero-content">
                  <span className="hero-badge">Featured Show</span>
                  <h1>{featuredMovie.title}</h1>
                  <p>{featuredMovie.plot.slice(0, 200)}...</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={btnPrimary} onClick={(e) => handleWatchNow(e, featuredMovie.watchLink)}>
                      <Play size={18} fill="white" /> Watch Now
                    </button>
                    <Link to={`/movie/${featuredMovie.id}`} style={btnSecondary}>
                      <Info size={18} /> Details
                    </Link>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Konten Utama */}
          <main className="container" style={queryParam ? { marginTop: '120px' } : {}}>
            <h2 className="section-title">
              {queryParam ? `Search Results for "${queryParam}"` : 'Recommended for You'}
            </h2>
            
            <div className="movie-grid">
              {movies.map(movie => (
                <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="poster-wrapper">
                    <img src={movie.poster} alt={movie.title} />
                    <div className="card-overlay">
                      <span className="btn-small-icon">
                        <Info size={18} style={{ marginRight: '0.5rem' }} /> View Info
                      </span>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <div className="movie-meta">
                      <span>{movie.year}</span>
                      <span className={`rating ${!movie.rating ? 'no-rating' : ''}`}>
                        <Star size={14} fill={movie.rating ? "#ffc107" : "none"} style={{ marginRight: '0.3rem' }} />
                        {movie.rating ? movie.rating : 'No Rating'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .search-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
          pointer-events: none;
        }
        .search-box input {
          padding-left: 3rem !important;
        }
        .btn-small-icon {
          padding: 0.6rem 2rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px var(--primary-glow);
        }
      `}} />
    </div>
  )
}

export default Home
