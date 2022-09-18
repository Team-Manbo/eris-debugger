declare module 'eris-debugger' {
  import * as Eris from 'eris'
  export default ErisDebugger

  class ErisDebugger {
    constructor(client: Eris.Client, options: ErisDebuggerOptions)
    public client: Eris.Client
    public options: ErisDebuggerOptions
    public run(message: Eris.Message): Promise<any>
  }

  interface ErisDebuggerOptions {
    aliases?: Array<string>
    owners?: Array<string>
    prefix?: string
    secrets?: Array<any>
    globalVariable?: Record<string, any>
    noPerm?: (message: Eris.Message) => any|Promise<any>
    isOwner?: (user: Eris.User) => boolean|Promise<boolean>
  }

  export class ProcessManager {
    constructor(message: Eris.Message, content: string, erisDebugger: ErisDebugger, options: ProcessOptions)
    public target: Eris.TextChannel
    public erisDebugger: ErisDebugger
    public content: string
    public messageContent: string
    public limit: number
    public splitted: Array<string>
    public page: number
    public author: Eris.User
    public actions: Array<Action>
    public options: ProcessOptions
  }

  interface ProcessOptions {
    limit?: number
    noCode?: boolean
    secrets?: Array<any>
    lang?: string
  }

  interface Action {
    emoji: string
    requirePage: boolean
    action({ manager: ErisDebugger, ...args }): any|Promise<any>
  }
}
