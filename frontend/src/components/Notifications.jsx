import React from 'react';
export const NotificationBell = () =>{
  return (
    <div className="notification-bell">
      <span role="img" aria-label="bell">🔔</span>
    </div>
  );
};

export const JobList = ({ jobs }) =>{
  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>{job.title} - {job.company}</li>
      ))}
    </ul>
  );
};
