"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const auth = sessionStorage.getItem("authenticated");
        setIsAuthenticated(auth === "true");
        setIsLoading(false);
    }, []);

    const logout = () => {
        sessionStorage.removeItem("authenticated");
        setIsAuthenticated(false);
        router.push("/login");
    };

    return { isAuthenticated, isLoading, logout };
}
