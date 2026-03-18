import { useEffect } from "react";
import API from "../services/api";

export default function Home() {
  useEffect(() => {
    API.get("/api/users")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  return <h1>Home Page</h1>;
}