
export type SendMessage = ( message: string, type: MessageID ) => void

export enum MessageID {
	OK,
	MISSING_DATA,
	INVALID_DATA
}