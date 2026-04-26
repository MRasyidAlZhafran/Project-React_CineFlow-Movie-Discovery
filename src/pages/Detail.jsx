import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  ChevronLeft, 
  Play, 
  Info,
  Tv
} from 'lucide-react'

function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovieDetails()
    window.scrollTo(0, 0)
  }, [id])

  const fetchMovieDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://api.tvmaze.com/shows/${id}`)
      const data = await response.json()
      
      const transformedData = {
        title: data.name,
        poster: data.image?.original || 'https://via.placeholder.com/600x900?text=No+Poster',
        rating: data.rating?.average || null,
        year: data.premiered?.split('-')[0] || 'TBA',
        plot: data.summary?.replace(/<[^>]*>/g, '') || 'No description available.',
        genres: data.genres || [],
        language: data.language,
        status: data.status,
        runtime: data.runtime,
        network: data.network?.name || data.webChannel?.name || 'Streaming',
        watchLink: data.officialSite || `https://www.youtube.com/results?search_query=${data.name}+official+trailer`
      }

      setMovie(transformedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching movie details:', error)
      setLoading(false)
    }
  }

  const handleWatchNow = () => {
    if (movie?.watchLink) {
      window.open(movie.watchLink, '_blank')
    }
  }

  // Fungsi kembali ke halaman sebelumnya
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container" style={{ marginTop: '150px', textAlign: 'center' }}>
        <h2>Movie not found.</h2>
        <button onClick={handleBack} className="back-btn">
          <ChevronLeft size={20} /> Back
        </button>
      </div>
    )
  }

  return (
    <div className="detail-page" style={{ position: 'relative' }}>
      <button onClick={handleBack} className="back-btn">
        <ChevronLeft size={20} /> Back
      </button>

      <div className="detail-hero">
        <div className="detail-hero-bg">
          <img src={movie.poster} alt={movie.title} />
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-poster-side">
          <img src={movie.poster} alt={movie.title} />
        </div>
        
        <div className="detail-info-side">
          <span className="hero-badge" style={{ marginBottom: '1rem' }}>{movie.status}</span>
          <h1>{movie.title}</h1>
          
          <div className="detail-meta-list">
            <div className="detail-meta-item">
              <Star size={18} color="#ffc107" fill="#ffc107" />
              <span>{movie.rating || 'No Rating'}</span>
            </div>
            <div className="detail-meta-item">
              <Calendar size={18} />
              <span>{movie.year}</span>
            </div>
            <div className="detail-meta-item">
              <Clock size={18} />
              <span>{movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
            </div>
            <div className="detail-meta-item">
              <Globe size={18} />
              <span>{movie.language}</span>
            </div>
          </div>

          <div className="modal-tags" style={{ marginBottom: '2rem' }}>
            {movie.genres.map(genre => (
              <span key={genre} className="tag">{genre}</span>
            ))}
          </div>

          <p className="detail-plot-full">{movie.plot}</p>

          <div className="modal-stats" style={{ maxWidth: '600px' }}>
            <div className="stat-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tv size={14} /> Network / Channel
              </span>
              <p>{movie.network}</p>
            </div>
            <div className="stat-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={14} /> Status
              </span>
              <p>{movie.status}</p>
            </div>
          </div>

          <div style={{ marginTop: '4rem' }}>
            <button className="btn-primary-large" onClick={handleWatchNow}>
              <Play size={20} fill="white" style={{ marginRight: '0.5rem' }} /> Watch Now
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .btn-primary-large {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.2rem 3rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 10px 20px var(--primary-glow);
        }
        .btn-primary-large:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px var(--primary-glow);
        }
      `}} />
    </div>
  )
}

export default Detail
