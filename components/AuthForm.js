// components/AuthForm.js

import { useState } from 'react'

export default function AuthForm({ trainer, onSuccess }) {
  const [editKey, setEditKey] = useState('')
  const [authError, setAuthError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleVerifyKey = async (e) => {
    e.preventDefault()
    setVerifying(true)
    setAuthError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slug: trainer.slug, 
          editKey: editKey 
        })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
      } else {
        setAuthError(data.error || '認証に失敗しました')
      }
    } catch (error) {
      setAuthError('エラーが発生しました')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Inter", -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        padding: '40px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>編集キー認証</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{trainer.name} 様</p>
        </div>

        {trainer.edit_key_hint && (
          <div style={{
            padding: '12px 20px',
            background: 'rgba(255,193,7,0.1)',
            border: '1px solid rgba(255,193,7,0.3)',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '11px', 
              color: 'rgba(255,193,7,0.8)', 
              marginBottom: '5px', 
              letterSpacing: '0.1em' 
            }}>
              💡 ヒント
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
              {trainer.edit_key_hint}
            </div>
          </div>
        )}

        <form onSubmit={handleVerifyKey}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#00d4ff',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              編集キーを入力してください
            </label>
            <input
              type="text"
              value={editKey}
              onChange={(e) => setEditKey(e.target.value)}
              placeholder="登録時に設定したキーワード"
              required
              autoComplete="off"
              style={{
                width: '100%',
                padding: '15px',
                background: 'transparent',
                border: '2px solid #00d4ff',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none'
              }}
            />
          </div>

          {authError && (
            <div style={{
              padding: '10px',
              background: 'rgba(255,0,0,0.2)',
              border: '1px solid rgba(255,0,0,0.4)',
              borderRadius: '5px',
              color: '#ff6b6b',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={verifying}
            style={{
              width: '100%',
              padding: '15px',
              background: verifying 
                ? '#666' 
                : 'linear-gradient(90deg, #00d4ff, #667eea)',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: verifying ? 'not-allowed' : 'pointer',
              WebkitAppearance: 'none',
              transition: 'all 0.3s'
            }}
          >
            {verifying ? '確認中...' : '認証する'}
          </button>
        </form>
      </div>
    </div>
  )
}