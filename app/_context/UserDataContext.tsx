"use client";

import { useSession } from "next-auth/react";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface userDatatype {
    image: string;
    name: string;
    email: string;
}
interface userContextType {
    user: userDatatype | null;
    setUser: (user: userDatatype | null) => void;
}

const UserInfoContext = createContext<userContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();

    const [user, setUser] = useState<userDatatype | null>(null);

    // recovering data from localstorage
    useEffect(() => {
        const savedUser = localStorage.getItem("userDATA");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // filling data in our state and localStorage
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const userInfo: userDatatype = {
                name: session?.user?.name|| "",
                email: session.user.email|| "",
                image: session.user.image|| "",
            };
            setUser(userInfo);
            localStorage.setItem("userDATA", JSON.stringify(userInfo));
        }
        if (status === "unauthenticated") {
            setUser(null);
            localStorage.removeItem("userDATA");
        }
    }, [session, status]);

    return (
        <UserInfoContext.Provider value={{ user, setUser }}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserInfoContext);

    // Prevent usage outside the provider
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
};
