export default function MusicSection({ trainer, theme }) {
  if (!trainer.spotify_url && !trainer.apple_music_url) {
    return null;
  }

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: '#000',
      padding: '100px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: theme.primary,
          marginBottom: '60px',
          textAlign: 'center',
          textTransform: 'uppercase'
        }}>
          Music Releases
        </div>
        
        <div style={{
          display: 'flex',
          gap: '40px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {trainer.spotify_url && (
            <a 
              href={trainer.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '300px',
                padding: '30px',
                border: `2px solid ${theme.primary}20`,
                borderRadius: '10px',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s',
                background: '#000'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${theme.primary}20`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                color: theme.primary,
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}>
                Listen on
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1DB954',
                marginBottom: '20px'
              }}>
                Spotify
              </div>
              <div style={{
                padding: '12px 30px',
                border: `2px solid ${theme.primary}`,
                borderRadius: '30px',
                color: theme.primary,
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'inline-block'
              }}>
                Play →
              </div>
            </a>
          )}
          
          {trainer.apple_music_url && (
            <a 
              href={trainer.apple_music_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '300px',
                padding: '30px',
                border: `2px solid ${theme.primary}20`,
                borderRadius: '10px',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s',
                background: '#000'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${theme.primary}20`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                color: theme.primary,
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}>
                Listen on
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#FA243C',
                marginBottom: '20px'
              }}>
                Apple Music
              </div>
              <div style={{
                padding: '12px 30px',
                border: `2px solid ${theme.primary}`,
                borderRadius: '30px',
                color: theme.primary,
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'inline-block'
              }}>
                Play →
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
