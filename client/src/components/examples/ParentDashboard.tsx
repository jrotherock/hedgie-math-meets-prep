import ParentDashboard from '../ParentDashboard';

export default function ParentDashboardExample() {
  // todo: remove mock functionality
  return (
    <div className="p-4">
      <ParentDashboard
        childName="Alex"
        compositeScore={186}
        targetScore={300}
        onSettingChange={(setting, value) => console.log(`${setting}: ${value}`)}
      />
    </div>
  );
}