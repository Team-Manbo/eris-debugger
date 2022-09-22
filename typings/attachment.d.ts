/**
 * https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure
 */
export interface APIAttachment {
    id: string
    filename: string
    description?: string
    content_type?: string
    size: number
    url: string
    proxy_url: string
    height?: number | null
    width?: number | null
    ephemeral?: boolean
}

export interface ErisAttachment {
    name: string
    file: Buffer
}
