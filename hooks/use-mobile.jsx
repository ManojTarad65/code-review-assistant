import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  const query = React.useMemo(
    () => `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    []
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}
