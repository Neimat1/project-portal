import { useSettings } from "../context/useSettings";

export default function SettingsPage() {
  const { compactList, setCompactList } = useSettings();

  return (
    <section className="settings-page">
      <h1>Settings</h1>

      <div className="settings-option">
        <label htmlFor="compact-list">Compact List</label>

        <input
          id="compact-list"
          type="checkbox"
          checked={compactList}
          onChange={(e) => setCompactList(e.target.checked)}
        />

        <p>Display projects in a more compact layout.</p>
      </div>
    </section>
  );
}
