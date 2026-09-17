import React, { useState } from 'react';
import { SearchIcon, UploadIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface CensusFile {
  id: string;
  name: string;
  employees: number;
  date: string;
  uploadedBy: string;
}

const mockCensusFiles: CensusFile[] = [
  { id: '1', name: 'NYL_Census_Q2_2024.xlsx', employees: 1310, date: 'Sep 12, 2024', uploadedBy: 'David Chen' },
  { id: '2', name: 'Census_Enterprise_Updated.xlsx', employees: 1420, date: 'Sep 5, 2024', uploadedBy: 'John Smith' },
  { id: '3', name: 'NYL_Census_Q1_2024.xlsx', employees: 1240, date: 'Aug 5, 2024', uploadedBy: 'Sarah Wilson' },
  { id: '4', name: 'Census_Draft.xlsx', employees: 990, date: 'Jul 28, 2024', uploadedBy: 'Mike Johnson' },
  { id: '5', name: 'NYL_Census_Q4_2023.xlsx', employees: 1150, date: 'Dec 10, 2023', uploadedBy: 'Emily Davis' }
];

interface CensusSelectorProps {
  onSelect?: (census: CensusFile) => void;
}

export function CensusSelector({ onSelect }: CensusSelectorProps): JSX.Element {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredFiles = mockCensusFiles.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (file: CensusFile) => {
    setSelectedId(file.id);
    onSelect?.(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search census files, uploaded by, or date..."
              className="h-10 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowUploadModal(true)}
          icon={<UploadIcon className="h-4 w-4" strokeWidth={1.75} />}>
          Upload New Census
        </Button>
      </div>

      <div className="space-y-2 rounded-md border border-line">
        {filteredFiles.map((file, idx) => (
          <label
            key={file.id}
            className={`flex cursor-pointer items-start gap-3 border-b border-line px-4 py-3 transition-colors last:border-0 hover:bg-canvas ${
              selectedId === file.id ? 'bg-primary-tint' : ''
            }`}>
            <div className="flex items-center pt-1">
              <input
                type="radio"
                name="census"
                value={file.id}
                checked={selectedId === file.id}
                onChange={() => handleSelect(file)}
                className="h-4 w-4 cursor-pointer text-primary focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-success">
                  <span className="text-xs font-bold text-white">X</span>
                </div>
                <p className="text-sm font-semibold text-ink">{file.name}</p>
              </div>
              <div className="mt-1 flex flex-wrap gap-4 text-xs text-muted">
                <span>👥 {file.employees.toLocaleString()} employees</span>
                <span>📅 {file.date}</span>
                <span>👤 By {file.uploadedBy}</span>
              </div>
            </div>
            <ChevronRightIcon className="mt-1 h-4 w-4 text-muted" strokeWidth={1.75} />
          </label>
        ))}
      </div>

      <p className="text-micro text-muted">
        Showing {filteredFiles.length} recent census files · <button className="font-semibold text-primary hover:underline">View All (12)</button>
      </p>

      {showUploadModal && (
        <div className="rounded-md border border-line bg-canvas p-4 text-center">
          <p className="text-sm font-semibold text-ink">Upload New Census File</p>
          <p className="mt-1 text-micro text-muted">CSV, TSV, XLSX · up to 5MB</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => setShowUploadModal(false)}>
            Choose File
          </Button>
        </div>
      )}

      <p className="flex items-center gap-2 text-micro text-muted">
        <span className="rounded-full bg-primary-tint px-1.5 py-0.5 font-semibold text-primary">i</span>
        Using standard assumptions (auto-configured). Editable in the case workspace after creation.
      </p>
    </div>
  );
}
