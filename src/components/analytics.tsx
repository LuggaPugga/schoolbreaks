import { configure } from "onedollarstats";
import { useEffect } from "react";

export default function OnedollarAnalytics() {
  useEffect(() => {
    configure();
  }, []);

  return null;
}