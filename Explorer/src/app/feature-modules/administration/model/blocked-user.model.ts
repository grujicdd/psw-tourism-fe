export interface BlockedUser {
    id: number;
    username: string;
    name: string;
    surname: string;
    role: string;
    blockCount: number;
    canBeUnblocked: boolean;
}