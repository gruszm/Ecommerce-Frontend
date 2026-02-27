import { createContext, useState, ReactNode } from "react";

type AuthContextProps = {
    isAuthenticated: boolean,
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    hasElevatedRights: boolean,
    setElevatedRights: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    setAuthenticated: () => { },
    hasElevatedRights: false,
    setElevatedRights: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [hasElevatedRights, setElevatedRights] = useState<boolean>(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, hasElevatedRights, setElevatedRights }}>
            {children}
        </AuthContext.Provider>
    );
}