import React from "react";
import { useUserStore } from "../../store/useUserStore";

export const OwnersList = () => {
  const { userProfile, fetchProfile, loading } = useUserStore();
  console.log("JAJAJJAJA", userProfile);
  return <>{userProfile === null ? <p>Hola no hay</p> : <div>si hay</div>}</>;
};
