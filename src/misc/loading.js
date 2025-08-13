import {useState, useEffect} from "react";
export default function Loading() {
    const [dots, setDots] = useState(1);
    const [takingAWhile, setTakingAWhile] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev => prev === 3 ? 1 : prev + 1));
            
        }, 500);
        return () => clearInterval(interval);
    }, [])
    useEffect(() => {
        const timer = setTimeout(() => {
            setTakingAWhile(true);
        }, 6250);
        return () => clearTimeout(timer);
    }, [])
  return (
    <>
    <div id = "loading-container">
      <div id="loading-circle" />
        <h1>Loading{".".repeat(dots)}</h1>
        <h2 style = {{display: takingAWhile ? "block" : "none"}}>This might take a while.</h2>
      </div>
    </>
  );
}
