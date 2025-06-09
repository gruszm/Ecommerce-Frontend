import { createContext, useState } from "react";

export const AuthContext = createContext(false);

export function AuthProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [hasElevatedRights, setElevatedRights] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, hasElevatedRights, setElevatedRights }}>
            {children}
        </AuthContext.Provider>
    );
}