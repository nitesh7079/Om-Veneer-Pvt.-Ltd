import React from 'react';

/**
 * Animated skeleton loader for table rows.
 * Shows a shimmering placeholder while data is being fetched.
 */
export const SkeletonRow = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div style={{
          height: '16px',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
          width: i === 0 ? '70%' : i === cols - 1 ? '60%' : '85%'
        }} />
      </td>
    ))}
  </tr>
);

/**
 * Animated skeleton card used in dashboard/stats panels.
 */
export const SkeletonCard = () => (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    borderLeft: '4px solid #e2e8f0'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ height: '12px', width: '50%', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: '36px', width: '36px', borderRadius: '10px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
    </div>
    <div style={{ height: '28px', width: '60%', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: '0.5rem' }} />
    <div style={{ height: '11px', width: '40%', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
  </div>
);

/**
 * Full-page skeleton screen for table-based pages like Ledgers, Vouchers, Inventory.
 */
const TableSkeleton = ({ title = 'Loading...', cols = 5, rows = 8, Navbar }) => (
  <>
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      {Navbar && <Navbar />}
      <div className="container mx-auto px-6 py-8">
        {/* Header skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ height: '42px', width: '200px', borderRadius: '10px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: '0.75rem' }} />
            <div style={{ height: '16px', width: '240px', borderRadius: '6px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
          </div>
          <div style={{ height: '52px', width: '160px', borderRadius: '12px', background: 'linear-gradient(90deg, #dbeafe 25%, #bfdbfe 50%, #dbeafe 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
        </div>

        {/* Filter bar skeleton */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderTop: '4px solid #06b6d4' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[1, 2].map(i => (
              <div key={i} style={{ height: '48px', borderRadius: '12px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            ))}
          </div>
        </div>

        {/* Table skeleton */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', borderTop: '4px solid #22c55e' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'linear-gradient(to right, #2563eb, #06b6d4)' }}>
              <tr>
                {Array.from({ length: cols }).map((_, i) => (
                  <th key={i} style={{ padding: '1rem 1.5rem', textAlign: 'left' }}>
                    <div style={{ height: '12px', width: '70%', borderRadius: '6px', background: 'rgba(255,255,255,0.3)' }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRow key={i} cols={cols} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
);

export default TableSkeleton;
