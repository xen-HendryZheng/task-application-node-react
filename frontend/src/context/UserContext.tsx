import {
    createContext,
    useContext,
    useState,
    ReactNode
} from 'react'

export interface User {
    email: string
    accessToken: string
}

interface UserContextType {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

function userSession(): User | null {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
}

export const UserContext = createContext<UserContextType>({
    user: userSession(),
    login: (user: User) => { },
    logout: () => { }
})

export function useUserContext() {
    return useContext(UserContext)
}

export function UserProvider({ children }: { children: ReactNode }) {
    const localUser = JSON.parse(localStorage.getItem('user') as string) || undefined;
    let [user, setUser] = useState(localUser);

    const login = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    const logout = () => {
        setUser(null)
        localStorage.clear();
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}
