import TeamRoleCard from '../TeamRoleCard';
import { useState } from 'react';

export default function TeamRoleCardExample() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // todo: remove mock functionality
  const roles = [
    { role: 'Starter', description: 'Grabs strengths first', color: 'blue' },
    { role: 'Scribe', description: 'Records clean answers', color: 'purple' },
    { role: 'Checker', description: 'Verifies & simplifies', color: 'yellow' },
    { role: 'Timekeeper', description: 'Calls 2-min check', color: 'green' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {roles.map((roleData, index) => (
        <TeamRoleCard
          key={index}
          role={roleData.role}
          description={roleData.description}
          color={roleData.color}
          isSelected={selectedRole === roleData.role}
          onClick={() => {
            setSelectedRole(roleData.role);
            console.log(`Selected role: ${roleData.role}`);
          }}
        />
      ))}
    </div>
  );
}