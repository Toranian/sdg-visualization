import { useEffect } from "react";
import { getCSVFile } from "./utils";

function App() {
  const getData = async () => {
    const { data } = await getCSVFile();
    console.log(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1 className="text-2xl">SDG Visualization</h1>
    </>
  );
}

export default App;
