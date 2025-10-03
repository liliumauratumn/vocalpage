import Image from 'next/image'

export default function VideoSection({ trainer, theme }) {
  if (!trainer.youtube_url) return null

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px',
      background: `radial-gradient(circle at center, ${theme.overlay}, #000)`
    }}>
      <div style={{ maxWidth: '1400px', width: '100%' }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: theme.primary,
          marginBottom: '40px',
          textAlign: 'center',
          textTransform: 'uppercase'
        }}>
          Demo Reel
        </div>
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          background: '#000',
          boxShadow: `0 0 100px ${theme.primary}40`,
          border: `1px solid ${theme.primary}20`
        }}>
          <iframe
            src={`${trainer.youtube_url.replace('watch?v=', 'embed/')}?rel=0&modestbranding=1`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              zIndex: 1
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
