import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const VehicleForm: React.FC = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [badge, setBadge] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [models, setModels] = useState<any>({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showBadgeDropdown, setShowBadgeDropdown] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mockdata`);
        if (!response.ok) {
          throw new Error("Failed to fetch model data");
        }
        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      }
    };

    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (!make || !model || !badge || !file) {
        throw new Error("Please complete all fields and upload a file.");
      }

      if (file.type !== "text/plain") {
        throw new Error("Only .txt files are allowed.");
      }

      const formData = new FormData();
      formData.append("make", make);
      formData.append("model", model);
      formData.append("badge", badge);
      formData.append("logbook", file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const data = await response.json();
      const resultText = `Make: ${data.make}\nModel: ${data.model}\nBadge: ${data.badge}\nLogbook:\n${data.logbook}`;
      navigate("/upload", { state: { resultText } });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(e.target.value);
    setModel("");
    setBadge("");
    setFile(null);
    setShowModelDropdown(true);
    setShowBadgeDropdown(false);
    setShowUploadSection(false);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
    setBadge("");
    setFile(null);
    setShowBadgeDropdown(true);
    setShowUploadSection(false);
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBadge(e.target.value);
    setFile(null);
    setShowUploadSection(true);
  };

  const handleQuickSelect = (vehicle: {
    make: string;
    model: string;
    badge: string;
  }) => {
    setMake(vehicle.make);
    setModel(vehicle.model);
    setBadge(vehicle.badge);
    setShowModelDropdown(true);
    setShowBadgeDropdown(true);
    setShowUploadSection(true);
  };

  return (
    <div className="container">
  <h1>Drill Down Form</h1>
  {error && <p className="error">{error}</p>}
  <form onSubmit={handleSubmit} className="form">
    <div className="form-group">
      <select value={make} onChange={handleMakeChange} className="dropdown">
        <option value="" disabled>
          make
        </option>
        {Object.keys(models).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      {showModelDropdown && (
        <select value={model} onChange={handleModelChange} className="dropdown">
          <option value="" disabled>
            model
          </option>
          {make &&
            Object.keys(models[make] || {}).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
        </select>
      )}
    </div>

    <div className="form-group">
      {showBadgeDropdown && (
        <select value={badge} onChange={handleBadgeChange} className="dropdown">
          <option value="" disabled>
            badge
          </option>
          {model &&
            (models[make]?.[model] || []).map((badge: string) => (
              <option key={badge} value={badge}>
                {badge}
              </option>
            ))}
        </select>
      )}
    </div>

    {showBadgeDropdown && showUploadSection && (
      <div className="form-group">
        <label>
          Upload Logbook:
          <input
            type="file"
            accept=".txt"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </label>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    )}
  </form>

  <div className="quickselect-section">
    <h1>Select a Vehicle</h1>
    <div className="quickselect-buttons">
      <button
        onClick={() =>
          handleQuickSelect({
            make: "tesla",
            model: "Model 3",
            badge: "Performance",
          })
        }
      >
        Tesla Model 3 Performance
      </button>
      <button
        onClick={() =>
          handleQuickSelect({
            make: "bmw",
            model: "130d",
            badge: "xDrive 26d",
          })
        }
      >
        BMW 130d xDrive 26d
      </button>
    </div>
  </div>
</div>

  );
};

export default VehicleForm;
