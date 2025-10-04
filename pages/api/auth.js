import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, editKey } = req.body

  if (!slug || !editKey) {
    return res.status(400).json({ error: '必要な情報が不足しています' })
  }

  const { data: trainer, error } = await supabase
    .from('trainers')
    .select('edit_key, name')
    .eq('slug', slug)
    .single()

  if (error || !trainer) {
    return res.status(404).json({ error: 'トレーナーが見つかりません' })
  }

  const inputKey = editKey.toLowerCase().trim()
  const storedKey = (trainer.edit_key || '').toLowerCase().trim()

  if (inputKey !== storedKey) {
    return res.status(403).json({ error: '編集キーが正しくありません' })
  }

  return res.status(200).json({ 
    success: true,
    name: trainer.name
  })
}