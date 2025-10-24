import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SocialShareMetaProps {
  title?: string
  description?: string
  url?: string
  image?: string
  type?: string
}

export function SocialShareMeta({
  title = "SocialID - One Link for All Your Socials",
  description = "Centralize all your social media links in one beautiful page. Share one link and let people find you everywhere.",
  url = "https://socialid.one/",
  image = "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
  type = "website"
}: SocialShareMetaProps) {
  const imageWithTimestamp = `${image}${image.includes('?') ? '&' : '?'}t=${Date.now()}`

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Cache Control */}
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageWithTimestamp} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SocialID" />
      <meta property="og:updated_time" content={new Date().toISOString()} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageWithTimestamp} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="SocialID" />
      <link rel="canonical" href={url} />
    </Helmet>
  )
}