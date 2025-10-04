const uploadLimitStore = new Map()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000
const MAX_UPLOADS = 5

function checkUploadLimit(ip) {
  const now = Date.now()
  const record = uploadLimitStore.get(ip)
  
  if (!record) {
    uploadLimitStore.set(ip, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW 
    })
    return { 
      allowed: true, 
      remaining: MAX_UPLOADS - 1,
      message: `残り${MAX_UPLOADS - 1}回アップロード可能`
    }
  }
  
  if (now > record.resetTime) {
    uploadLimitStore.set(ip, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW 
    })
    return { 
      allowed: true, 
      remaining: MAX_UPLOADS - 1,
      message: `残り${MAX_UPLOADS - 1}回アップロード可能`
    }
  }
  
  if (record.count >= MAX_UPLOADS) {
    const minutesLeft = Math.ceil((record.resetTime - now) / 60000)
    return { 
      allowed: false, 
      remaining: 0,
      resetIn: minutesLeft,
      message: `アップロード回数の上限に達しました。${minutesLeft}分後に再試行してください。`
    }
  }
  
  record.count += 1
  uploadLimitStore.set(ip, record)
  return { 
    allowed: true, 
    remaining: MAX_UPLOADS - record.count,
    message: record.count === MAX_UPLOADS 
      ? 'これで上限です。次は1時間後から可能です。' 
      : `残り${MAX_UPLOADS - record.count}回アップロード可能`
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] || 
             req.socket.remoteAddress || 
             'unknown'

  const limit = checkUploadLimit(ip)
  
  if (!limit.allowed) {
    return res.status(429).json({ 
      error: limit.message,
      resetIn: limit.resetIn
    })
  }

  return res.status(200).json({ 
    allowed: true,
    remaining: limit.remaining,
    message: limit.message
  })
}