import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"
const SPOTIFY_PLAYER_ENDPOINT = "https://api.spotify.com/v1/me/player"
const SPOTIFY_CURRENTLY_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing"
const SPOTIFY_RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1"

type SpotifyTrackResponse = {
  is_playing?: boolean
  item?: {
    name: string
    external_urls: { spotify: string }
    preview_url: string | null
    artists: { name: string }[]
    album: {
      name: string
      images: { url: string }[]
    }
  }
}

type SpotifyPlayerResponse = {
  is_playing?: boolean
  item?: SpotifyTrackResponse["item"]
  device?: {
    name: string
  }
}

type SpotifyRecentResponse = {
  items: {
    played_at: string
    track: SpotifyTrackResponse["item"]
  }[]
}

const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    return null
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify access token")
  }

  const data = (await response.json()) as { access_token: string }
  return data.access_token
}

const mapTrack = (
  track: NonNullable<SpotifyTrackResponse["item"]>,
  options: { isPlaying: boolean; playedAt?: string; deviceName?: string }
) => ({
  isPlaying: options.isPlaying,
  title: track.name,
  artist: track.artists.map((artist) => artist.name).join(", "),
  album: track.album.name,
  albumImageUrl: track.album.images?.[0]?.url ?? null,
  songUrl: track.external_urls.spotify,
  previewUrl: track.preview_url,
  playedAt: options.playedAt ?? null,
  deviceName: options.deviceName ?? null,
})

export async function GET() {
  try {
    const token = await getAccessToken()

    if (!token) {
      return NextResponse.json({ isConfigured: false })
    }

    const playerResponse = await fetch(SPOTIFY_PLAYER_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (playerResponse.status === 200) {
      const playerData = (await playerResponse.json()) as SpotifyPlayerResponse
      if (playerData.is_playing && playerData.item) {
        return NextResponse.json({
          isConfigured: true,
          ...mapTrack(playerData.item, {
            isPlaying: true,
            deviceName: playerData.device?.name,
          }),
        })
      }
    }

    const shouldTryCurrentlyPlaying =
      playerResponse.status === 401 || playerResponse.status === 403

    if (shouldTryCurrentlyPlaying) {
      const currentResponse = await fetch(SPOTIFY_CURRENTLY_PLAYING_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })

      if (currentResponse.status === 200) {
        const currentData =
          (await currentResponse.json()) as SpotifyTrackResponse
        if (currentData.is_playing && currentData.item) {
          return NextResponse.json({
            isConfigured: true,
            ...mapTrack(currentData.item, { isPlaying: true }),
          })
        }
      }
    }

    const recentResponse = await fetch(SPOTIFY_RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!recentResponse.ok) {
      throw new Error("Failed to fetch recently played tracks")
    }

    const recentData = (await recentResponse.json()) as SpotifyRecentResponse
    const lastPlayed = recentData.items?.[0]

    if (!lastPlayed?.track) {
      return NextResponse.json({ isConfigured: true, isPlaying: false })
    }

    return NextResponse.json({
      isConfigured: true,
      ...mapTrack(lastPlayed.track, {
        isPlaying: false,
        playedAt: lastPlayed.played_at,
      }),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { isConfigured: true, error: "Unable to load Spotify data." },
      { status: 500 }
    )
  }
}
