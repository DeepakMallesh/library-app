import React from 'react';
import { quickFilters } from '../../data/mockData';

export default function QuickFilters({ filters, toggleFilter }) {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map(f => (
        <div
          key={f.id}
          onClick={() => toggleFilter(f.id)}
          className={`filter-chip ${f.active ? 'bg-amazon-orange text-white' : ''}`}
        >
          {f.label}
        </div>
      ))}
    </div>
  );
}
