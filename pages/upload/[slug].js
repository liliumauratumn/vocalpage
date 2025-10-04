// pages/upload/[slug].js

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import AuthForm from '../../components/AuthForm'
import UploadForm from '../../components/UploadForm'
import UploadSuccess from '../../components/UploadSuccess'

export default function UploadPage({ trainer }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [wasUpdate, setWasUpdate] = useState(false)

  // 認証前：編集キー入力画面
  if (!isAuthenticated) {
    return (
      <AuthForm 
        trainer={trainer} 
        onSuccess={() => setIsAuthenticated(true)} 
      />
    )
  }

  // アップロード完了後：成功画面
  if (uploadSuccess) {
    const pageUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/${trainer.slug}` 
      : `/${trainer.slug}`
    
    return (
      <UploadSuccess 
        trainerName={trainer.name}
        pageUrl={pageUrl}
        themeColor={trainer.theme_color || 'blue'}
        wasUpdate={wasUpdate}
      />
    )
  }

  // 認証後：画像アップロード画面
  return (
    <UploadForm 
      trainer={trainer}
      onSuccess={(wasActive) => {
        setWasUpdate(wasActive)
        setUploadSuccess(true)
      }}
    />
  )
}

export async function getServerSideProps({ params }) {
  const { data: trainer } = await supabase
    .from('trainers')
    .select('slug, name, theme_color, edit_key_hint')
    .eq('slug', params.slug)
    .single()

  if (!trainer) {
    return { notFound: true }
  }

  return { props: { trainer } }
}