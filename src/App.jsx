import React, { useEffect, useRef, useState } from 'react'
import { Bell, ChevronLeft, ChevronRight, Home, Library, ListMusic, Menu, Pause, Play, Plus, Repeat2, Search, Shuffle, SkipBack, SkipForward, Volume2, X } from 'lucide-react'

const tracks = [
  { id: 1, title: 'Late Night Drive', artist: 'Milo June', album: 'Neon Hours', color: '#e38b54', duration: '3:42', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Honey on the Sidewalk', artist: 'The Sunroom', album: 'Small Miracles', color: '#b7c86b', duration: '4:08', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Soft Focus', artist: 'Asha Vale', album: 'Afterimage', color: '#80a9bc', duration: '3:26', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, title: 'Cherry Cola', artist: 'Good Company', album: 'Good Company', color: '#d46c6c', duration: '3:51', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
]

const mixes = [
  { title: 'Your commute, sorted', detail: 'Warm indie + a little momentum', color: '#d7794d', icon: '✦' },
  { title: 'Kitchen radio', detail: 'Good songs for chopping things', color: '#a5b85d', icon: '◒' },
  { title: 'Cloud cover', detail: 'A gentle place to disappear into', color: '#7396b8', icon: '☁' },
]

function App() {
  const audioRef = useRef(null)
  const [current, setCurrent] = useState(tracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [query, setQuery] = useState('')
  const [progress, setProgress] = useState(22)
  const [volume, setVolume] = useState(72)
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const sync = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    audio.addEventListener('timeupdate', sync)
    audio.addEventListener('ended', nextTrack)
    return () => { audio.removeEventListener('timeupdate', sync); audio.removeEventListener('ended', nextTrack) }
  }, [current])

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume / 100 }, [volume])

  function playTrack(track) {
    setCurrent(track)
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play().catch(() => setIsPlaying(false)), 0)
  }

  function togglePlay() {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play().catch(() => setIsPlaying(false))
    setIsPlaying(!isPlaying)
  }

  function nextTrack() {
    const index = tracks.findIndex((track) => track.id === current.id)
    playTrack(tracks[(index + 1) % tracks.length])
  }

  function previousTrack() {
    const index = tracks.findIndex((track) => track.id === current.id)
    playTrack(tracks[(index - 1 + tracks.length) % tracks.length])
  }

  function seek(value) {
    setProgress(value)
    if (audioRef.current?.duration) audioRef.current.currentTime = (value / 100) * audioRef.current.duration
  }

  const visibleTracks = tracks.filter((track) => `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>freeflow</span></div>
        <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={20} /></button>
        <nav className="primary-nav">
          <button className="active"><Home size={19} /> Home</button>
          <button><Search size={19} /> Discover</button>
          <button><Library size={19} /> Your library</button>
        </nav>
        <div className="nav-section">
          <div className="section-label">Your collection <Plus size={16} /></div>
          <button className="playlist"><span className="playlist-cover rose">♫</span> Liked songs</button>
          <button className="playlist"><span className="playlist-cover lime">✦</span> Sunday reset</button>
          <button className="playlist"><span className="playlist-cover blue">◒</span> Workday focus</button>
        </div>
        <div className="sidebar-note"><span className="signal-dot" /> No paywalls, ever.<small>Play as much as you like.</small></div>
      </aside>

      <main className="main-view">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div className="history"><button aria-label="Back"><ChevronLeft size={20} /></button><button aria-label="Forward"><ChevronRight size={20} /></button></div>
          <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What do you want to hear?" /></label>
          <button className="icon-button" aria-label="Notifications"><Bell size={19} /></button>
          <button className="profile">JC</button>
        </header>

        <section className="hero-section">
          <div className="eyebrow"><span className="live-dot" /> Free listening, always</div>
          <h1>Good music.<br /><em>No fine print.</em></h1>
          <p className="hero-copy">A calm corner of the internet for endless listening. No premium tier, no interruptions, just press play.</p>
          <div className="hero-actions"><button className="primary-cta" onClick={() => playTrack(tracks[0])}><Play size={17} fill="currentColor" /> Start listening</button><button className="text-cta">Explore the library <ChevronRight size={16} /></button></div>
          <div className="hero-art" aria-hidden="true"><div className="sun" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="art-label">FM<br /><span>24/7</span></div></div>
        </section>

        <section className="content-section"><div className="section-heading"><div><p className="kicker">Made for right now</p><h2>Pick a mood</h2></div><button className="see-all">See all <ChevronRight size={16} /></button></div><div className="mix-grid">{mixes.map((mix) => <button className="mix-card" key={mix.title} onClick={() => playTrack(tracks[mixes.indexOf(mix)])}><div className="mix-art" style={{ backgroundColor: mix.color }}><span>{mix.icon}</span><i /></div><strong>{mix.title}</strong><small>{mix.detail}</small></button>)}</div></section>

        <section className="content-section tracks-section"><div className="section-heading"><div><p className="kicker">The freeflow rotation</p><h2>On repeat</h2></div><button className="see-all">Open queue <ListMusic size={16} /></button></div><div className="track-list">{visibleTracks.map((track, index) => <button className={`track-row ${current.id === track.id ? 'selected' : ''}`} key={track.id} onClick={() => playTrack(track)}><span className="track-number">{current.id === track.id && isPlaying ? <span className="playing-bars"><i /><i /><i /></span> : String(index + 1).padStart(2, '0')}</span><span className="track-art" style={{ background: track.color }}>{index === 0 ? '◒' : index === 1 ? '✳' : index === 2 ? '☾' : '✦'}</span><span className="track-info"><strong>{track.title}</strong><small>{track.artist}</small></span><span className="track-album">{track.album}</span><span className="track-duration">{track.duration}</span><span className="track-play"><Play size={15} fill="currentColor" /></span></button>)}</div></section>
        <footer><span>freeflow music club</span><span>Built for listening, not upselling.</span></footer>
      </main>

      <div className="player"><div className="now-playing"><span className="now-art" style={{ background: current.color }}>{current.title[0]}</span><span><strong>{current.title}</strong><small>{current.artist}</small></span><button className={liked ? 'liked' : ''} onClick={() => setLiked(!liked)} aria-label="Like song">♡</button></div><div className="player-controls"><div className="control-buttons"><button aria-label="Shuffle"><Shuffle size={17} /></button><button aria-label="Previous" onClick={previousTrack}><SkipBack size={18} fill="currentColor" /></button><button className="play-button" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button aria-label="Next" onClick={nextTrack}><SkipForward size={18} fill="currentColor" /></button><button aria-label="Repeat"><Repeat2 size={17} /></button></div><div className="progress-line"><span>0:48</span><input type="range" min="0" max="100" value={progress} onChange={(event) => seek(event.target.value)} aria-label="Track progress" /><span>{current.duration}</span></div></div><div className="volume"><Volume2 size={17} /><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(event.target.value)} aria-label="Volume" /></div></div>
      <audio ref={audioRef} src={current.src} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
    </div>
  )
}

export default App
