export default function CTASection({ trainer, theme }) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      padding: '100px 20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(40px, 8vw, 100px)',
          fontWeight: '900',
          marginBottom: '60px',
          color: '#fff'
        }}>
          LET'S TALK
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'WEB', url: trainer.website_url },
            { label: 'IG', url: trainer.instagram_url },
            { label: 'X', url: trainer.twitter_url },
            { label: 'YT', url: trainer.youtube_url },
            { label: 'LINE', url: trainer.line_url }
          ].filter(item => item.url).map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{
              width: '50px',
              height: '50px',
              border: `2px solid ${theme.primary}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.primary,
              fontSize: '11px',
              textDecoration: 'none',
              transition: 'all 0.3s',
              fontWeight: '600'
            }}>
              {item.label}
            </a>
          ))}
        </div>
        
        <a 
          href={trainer.contact}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '25px 80px',
            background: 'transparent',
            border: `2px solid ${theme.primary}`,
            color: theme.primary,
            fontSize: '14px',
            letterSpacing: '0.3em',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = theme.primary;
            e.target.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = theme.primary;
          }}
        >
          Contact
        </a>
      </div>
    </section>
  )
}
