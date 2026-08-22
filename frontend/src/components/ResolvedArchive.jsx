import { useState, useMemo } from 'react';
import GovernmentEmblem from './GovernmentEmblem';
import './ResolvedArchive.css';

function ResolvedArchive({ records, onClearArchive, onDeleteRecord, onBackToMap, onBackToPortal, activeLanguage = 'en-IN' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [resolvedByFilter, setResolvedByFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Filtered list based on search and filters
  const filteredRecords = useMemo(() => {
    return (records || []).filter(item => {
      const matchesSearch = 
        (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.district && item.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.state && item.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.department && item.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.resolvedByRole && item.resolvedByRole.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (deptFilter !== 'all' && item.deptKey !== deptFilter) return false;
      if (resolvedByFilter === 'citizen' && item.resolvedByRole !== 'citizen') return false;
      if (resolvedByFilter === 'authority' && item.resolvedByRole !== 'authority') return false;
      return true;
    });
  }, [records, searchTerm, deptFilter, resolvedByFilter]);

  // Quick stats
  const totalCount = records?.length || 0;
  const citizenVerifiedCount = records?.filter(r => r.resolvedByRole === 'citizen').length || 0;
  const govtVerifiedCount = records?.filter(r => r.resolvedByRole === 'authority').length || 0;

  const handleCopyRecord = (record) => {
    const text = `[JanDhwani Resolution Record]\nTicket: ${record.id}\nIssue: ${record.title}\nDept: ${record.department}\nLocation: ${record.district}, ${record.state}\nResolved By: ${record.resolvedByName || (record.resolvedByRole === 'citizen' ? 'Citizen' : 'Govt Authority')}\nResolution: ${record.resolutionRemarks}\nTimestamp: ${record.resolvedAt}`;
    navigator.clipboard.writeText(text);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `JanDhwani_Resolved_Records_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="resolved-archive-wrapper">
      {/* Top Header */}
      <div className="archive-top-header">
        <div className="header-nav-actions">
          <GovernmentEmblem size={42} compact={true} theme="dark" />
          <div className="archive-nav-btns-group">
            <button type="button" className="archive-back-btn" onClick={onBackToMap}>
              3D Digital Twin Map
            </button>
            <button type="button" className="archive-back-btn secondary" onClick={onBackToPortal}>
              Grievance Portal
            </button>
          </div>
        </div>

        <div className="archive-titles">
          <h2>Resolved Issues Archive & Records Ledger</h2>
          <p>Concise, audit-verified records of remediated civic grievances and citizen sign-offs</p>
        </div>

        <div className="archive-top-stats">
          <div className="stat-pill">
            <span className="stat-num">{totalCount}</span>
            <span className="stat-label">Total Remediated</span>
          </div>
          <div className="stat-pill highlight-green">
            <span className="stat-num">{citizenVerifiedCount}</span>
            <span className="stat-label">Citizen Confirmed</span>
          </div>
          <div className="stat-pill highlight-orange">
            <span className="stat-num">{govtVerifiedCount}</span>
            <span className="stat-label">Authority Signed</span>
          </div>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="archive-toolbar">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by Ticket ID, Issue, District, Department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <div className="toolbar-filters">
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="all">All Departments</option>
            <option value="sanitation_swm">Solid Waste & Sanitation</option>
            <option value="jal_shakti">Jal Shakti (Water)</option>
            <option value="pwd">PWD (Roads & Bridges)</option>
            <option value="power">Power & Energy</option>
            <option value="health_fda">Health & Public Safety</option>
          </select>

          <select value={resolvedByFilter} onChange={(e) => setResolvedByFilter(e.target.value)}>
            <option value="all">All Resolution Types</option>
            <option value="citizen">Citizen Sign-Offs</option>
            <option value="authority">Govt Authority Completions</option>
          </select>

          {totalCount > 0 && (
            <div className="archive-actions-group">
              <button 
                type="button" 
                className="export-btn"
                onClick={handleExportJson}
                title="Download JSON Ledger"
              >
                Export JSON
              </button>
              <button 
                type="button" 
                className="clear-archive-btn"
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all resolved records from the archive?")) {
                    onClearArchive();
                  }
                }}
              >
                Clear Archive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Records Container */}
      <div className="archive-content-area">
        {filteredRecords.length === 0 ? (
          <div className="empty-archive-card">
            <h3>{totalCount === 0 ? 'No Resolved Records in Archive' : 'No Matching Records Found'}</h3>
            <p>
              {totalCount === 0
                ? 'When an active complaint is marked as resolved by either a Citizen or a Government Authority, its concise audit record will be stored here permanently.'
                : 'Try adjusting your search query or department filter.'}
            </p>
            {totalCount === 0 && (
              <button type="button" className="go-map-btn" onClick={onBackToMap}>
                View Active 3D Twin Map to Resolve Issues
              </button>
            )}
          </div>
        ) : (
          <div className="records-grid">
            {filteredRecords.map((item) => {
              const isCitizen = item.resolvedByRole === 'citizen';
              return (
                <div key={item.id} className="record-card">
                  {/* Top Bar of Card */}
                  <div className="record-card-top">
                    <div className="record-id-row">
                      <span className="record-ticket-id">ID: {item.id}</span>
                      <span className={`record-role-badge ${isCitizen ? 'badge-citizen' : 'badge-authority'}`}>
                        {isCitizen ? 'Citizen Confirmed' : 'Govt Authority Action'}
                      </span>
                    </div>

                    <div className="record-meta-right">
                      <span className="record-time">{item.turnaroundTime || 'Resolved'}</span>
                      <button 
                        type="button" 
                        className="copy-record-btn" 
                        onClick={() => handleCopyRecord(item)}
                        title="Copy Summary"
                      >
                        {copiedId === item.id ? 'Copied' : 'Copy'}
                      </button>
                      {onDeleteRecord && (
                        <button 
                          type="button" 
                          className="delete-record-btn" 
                          onClick={() => onDeleteRecord(item.id)}
                          title="Remove from Records"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Core Issue Title & Dept */}
                  <h4 className="record-title">{item.title}</h4>
                  
                  <div className="record-location-row">
                    <span className="loc-chip">{item.district}, {item.state}</span>
                    <span className="dept-chip">{item.department}</span>
                  </div>

                  {/* Concise Resolution Box */}
                  <div className={`record-resolution-box ${isCitizen ? 'box-citizen' : 'box-authority'}`}>
                    <div className="res-box-header">
                      <span className="res-author">
                        {isCitizen 
                          ? `Citizen Sign-Off (${item.resolvedByName || item.citizen || 'Verified Resident'})`
                          : `Authority Order (${item.officerName || item.routing || 'Zonal Engineer / DM'})`}
                      </span>
                      {item.rating && (
                        <span className="res-stars">
                          {'★'.repeat(item.rating)} ({item.rating}/5)
                        </span>
                      )}
                      {item.budgetSpent && (
                        <span className="res-budget">
                          Budget: {item.budgetSpent}
                        </span>
                      )}
                    </div>
                    <p className="res-remarks">
                      "{item.resolutionRemarks || item.actionTaken || 'Grievance remediated and ground verified.'}"
                    </p>
                  </div>

                  {/* Quick Footer */}
                  <div className="record-footer">
                    <small className="audit-date">
                      Timestamp: <strong>{item.resolvedAt || new Date().toLocaleString()}</strong>
                    </small>
                    <span className="audit-hash-pill">
                      Audit ID: #{item.id.replace('JD-', 'AUD-')}-VERIFIED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResolvedArchive;
