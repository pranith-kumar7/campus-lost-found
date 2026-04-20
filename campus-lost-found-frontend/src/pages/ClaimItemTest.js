import React, { useEffect } from "react";
import API from "../api/axios";

export default function ClaimItemTest() {
  useEffect(() => {
    API.get("/claims/pending")
      .then((res) => console.log("Fetched data:", res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return <div>Check console for fetch results</div>;
}
