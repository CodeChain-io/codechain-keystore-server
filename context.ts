import { CCKey } from "codechain-keystore";

export interface Context {
    cckey: CCKey;
}

export async function createContext(): Promise<Context> {
    const cckey = await CCKey.create({
        useMemoryDB: process.env.NODE_ENV !== "production"
    });
    return {
        cckey
    }
}

export function closeContext(context: Context): Promise<void> {
    return context.cckey.close();
}
