import { useState } from "react";
import "./PricingForm.css";

const packageDetails = {
  Legacy: { quests: 3, addons: ["10"] },
  Essential: { quests: 3, addons: ["10"] },
  Foundation: { quests: 15, addons: ["10", "9999"] },
  Advanced: { quests: 25, addons: ["10", "9999"] },
};

const PricingForm = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [monthlyAddon, setMonthlyAddon] = useState("0");
  const [oneTimeAddon, setOneTimeAddon] = useState("0");
  const [history, setHistory] = useState([]);

  const handlePackageChange = (event) => {
    const pkg = event.target.value;
    setSelectedPackage(pkg);
    setMonthlyAddon("0");
    setOneTimeAddon("0");
  };

  const handleAddOneTimeAddon = () => {
    if (oneTimeAddon !== "0" && selectedPackage) {
      const addonLabel = filterAddons(
        packageDetails[selectedPackage].addons
      ).find((addon) => addon.value === oneTimeAddon)?.label;

      const newHistoryEntry = {
        id: history.length + 1,
        description: `Added ${addonLabel} to one-time add-ons`,
        date: new Date().toLocaleString(),
      };

      setHistory([...history, newHistoryEntry]);
      setOneTimeAddon("0");
    }
  };

  const filterAddons = (addons) => {
    return addons.map((addon) => {
      if (addon === "10") {
        return { value: "10", label: "10 quest. ($7,500)" };
      }
      if (addon === "9999") {
        return { value: "9999", label: "Unlimited ($15,000/$20,000)" };
      }
      return null;
    });
  };

  const calculateSummary = () => {
    const baseQuests = selectedPackage
      ? packageDetails[selectedPackage].quests
      : 0;
    const totalQuestsPerMonth = baseQuests + parseInt(monthlyAddon, 10);
    const totalMonthlyCost = parseInt(monthlyAddon, 10) > 0 ? 7500 : 0;

    return {
      selectedPackage,
      baseQuests,
      totalQuestsPerMonth,
      totalMonthlyCost,
    };
  };

  const summary = calculateSummary();

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Pricing & Add-on Form</h2>
        <div>
          <label htmlFor="package">Select Package:</label>
          <select
            id="package"
            value={selectedPackage}
            onChange={handlePackageChange}
          >
            <option value="">-- Select Package --</option>
            <option value="Legacy">Legacy (3 quest./month)</option>
            <option value="Essential">Essential (3 quest./month)</option>
            <option value="Foundation">Foundation (15 quest./month)</option>
            <option value="Advanced">Advanced (25 quest./month)</option>
          </select>
        </div>

        <div>
          <label htmlFor="monthly-addon">Monthly Add-ons:</label>
          <select
            id="monthly-addon"
            value={monthlyAddon}
            onChange={(e) => setMonthlyAddon(e.target.value)}
            disabled={!selectedPackage}
          >
            <option value="0">No Add-on</option>
            {selectedPackage &&
              filterAddons(packageDetails[selectedPackage].addons).map(
                (addon) => (
                  <option key={addon.value} value={addon.value}>
                    {addon.label}
                  </option>
                )
              )}
          </select>
        </div>

        <div>
          <label htmlFor="one-time-addon">One-time Add-ons:</label>
          <select
            id="one-time-addon"
            value={oneTimeAddon}
            onChange={(e) => setOneTimeAddon(e.target.value)}
            disabled={!selectedPackage}
          >
            <option value="0">No Add-on</option>
            {selectedPackage &&
              filterAddons(packageDetails[selectedPackage].addons).map(
                (addon) => (
                  <option key={addon.value} value={addon.value}>
                    {addon.label}
                  </option>
                )
              )}
          </select>
          <button
            onClick={handleAddOneTimeAddon}
            disabled={!selectedPackage || oneTimeAddon === "0"}
          >
            Add One-time Add-on
          </button>
        </div>

        <div>
          <h3>History</h3>
          <ul>
            {history.map((entry) => (
              <li key={entry.id}>
                {entry.description} on {entry.date}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Plan Summary</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            <strong>Package:</strong> {summary.selectedPackage || "None"}
          </li>
          <li>
            <strong>Base Quests:</strong> {summary.baseQuests}
          </li>
          <li>
            <strong>Total Quests per Month:</strong>{" "}
            {summary.totalQuestsPerMonth}
          </li>
          <li>
            <strong>Monthly Add-on Quests:</strong>{" "}
            {parseInt(monthlyAddon, 10) || 0}
          </li>
          <li>
            <strong>Total Monthly Cost:</strong> $
            {summary.totalMonthlyCost.toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PricingForm;
