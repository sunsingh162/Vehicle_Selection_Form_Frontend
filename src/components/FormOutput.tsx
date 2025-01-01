import { useLocation } from "react-router-dom";

const FormOutput: React.FC = () => {
  const location = useLocation();
  const resultText = location.state?.resultText || "No data available";

  return (
    <div>
      <pre>{resultText}</pre>
    </div>
  );
};
export default FormOutput;
