/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-structure
 */
export interface Embed {
    title?: string
    type?: EmbedType
    description?: string
    url?: string
    timestamp?: string
    color?: number
    footer?: EmbedFooter
    image?: EmbedImage
    thumbnail?: EmbedThumbnail
    video?: EmbedVideo
    provider?: EmbedProvider
    author?: EmbedAuthor
    fields?: Array<EmbedField>
}

export enum EmbedType {
    Rich = 'rich',
    Image = 'image',
    Video = 'video',
    GIFV = 'gifv',
    Article = 'article',
    Link = 'link'
}

export interface EmbedFooter {
    text: string
    icon_url?: string
    proxy_icon_url?: string
}

export interface EmbedImage {
    url: string
    proxy_url?: string
    height?: number
    width?: number
}

export interface EmbedThumbnail {
    url: string
    proxy_url?: string
    height?: number
    width?: number
}

export interface EmbedVideo {
    url?: string
    proxy_url?: string
    height?: number
    width?: number
}

export interface EmbedProvider {
    name?: string
    url?: string
}

export interface EmbedAuthor {
    name: string
    url?: string
    icon_url?: string
    proxy_icon_url?: string
}

export interface EmbedFooter {
    text: string
    icon_url?: string
    proxy_icon_url?: string
}

export interface EmbedField {
    name: string
    value: string
    inline?: boolean
}
