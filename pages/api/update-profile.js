// pages/api/update-profile.js
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, formData } = req.body

  if (!slug || !formData) {
    return res.status(400).json({ error: '必要な情報が不足しています' })
  }

  // career_start_yearを数値に変換（空の場合はnull）
  const careerStartYear = formData.career_start_year 
    ? parseInt(formData.career_start_year) 
    : null

  // 更新データを準備
  const updateData = {
    name: formData.name,
    area: formData.area,
    bio: formData.bio,
    specialties: formData.specialties || [],
    lesson_types: formData.lesson_types || [],
    career_start_year: careerStartYear,
    price: formData.price,
    lesson_duration: formData.lesson_duration,
    youtube_url: formData.youtube_url,
    website_url: formData.website_url,
    instagram_url: formData.instagram_url,
    twitter_url: formData.twitter_url,
    line_url: formData.line_url,
    contact: formData.contact
  }

  // Supabaseで更新
  const { data, error } = await supabase
    .from('trainers')
    .update(updateData)
    .eq('slug', slug)
    .select()

  if (error) {
    console.error('更新エラー:', error)
    return res.status(500).json({ 
      error: '保存に失敗しました',
      details: error.message 
    })
  }

  return res.status(200).json({ 
    success: true,
    message: '保存しました',
    data: data[0]
  })
}