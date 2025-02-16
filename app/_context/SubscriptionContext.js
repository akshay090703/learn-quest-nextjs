"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const refetch = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/subscription/status?userId=${user.id}`
      );

      if (response.status === 200) {
        setIsActive(response.data.isActive);
        setStatus(response.data.status);
      } else {
        setIsActive(false);
        setStatus(null);
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(isActive);
    console.log(status);
  }, [isActive, status]);

  useEffect(() => {
    if (!user) return;

    refetch();
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{ isActive, status, loading, refetch }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
