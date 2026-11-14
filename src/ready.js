import { createContext, useContext } from 'react'

// true once the welcome loader has finished (so hero animations play after it, not behind it)
export const ReadyCtx = createContext(true)
export const useReady = () => useContext(ReadyCtx)
