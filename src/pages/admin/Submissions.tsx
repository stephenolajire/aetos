import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Filter, Loader2, ExternalLink, Download } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { 
  collection, 
  getDocs,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface Submission {
  id: string
  name: string
  email: string
  formType: 'contact' | 'consultation' | 'mentorship'
  createdAt: any
  fullData: Record<string, any>
}

const ITEMS_PER_PAGE = 10

export default function AdminSubmissions() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'consultation' | 'mentorship'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        setError(null)

        const contactDocs = await getDocs(collection(db, 'contact_messages'))
        const consultationDocs = await getDocs(collection(db, 'consultation_requests'))
        const mentorshipDocs = await getDocs(collection(db, 'mentorship_applications'))

        const allSubmissions: Submission[] = [
          ...contactDocs.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || 'Unknown',
            email: doc.data().email || 'N/A',
            formType: 'contact' as const,
            createdAt: doc.data().createdAt,
            fullData: doc.data(),
          })),
          ...consultationDocs.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || 'Unknown',
            email: doc.data().email || 'N/A',
            formType: 'consultation' as const,
            createdAt: doc.data().createdAt,
            fullData: doc.data(),
          })),
          ...mentorshipDocs.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().fullName || 'Unknown',
            email: doc.data().email || 'N/A',
            formType: 'mentorship' as const,
            createdAt: doc.data().createdAt,
            fullData: doc.data(),
          })),
        ]

        allSubmissions.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
          return dateB.getTime() - dateA.getTime()
        })

        setSubmissions(allSubmissions)
        setCurrentPage(1)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submissions'
        setError(errorMessage)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const handleExport = () => {
    const dataToExport = filterType === 'all' 
      ? submissions 
      : submissions.filter(s => s.formType === filterType)

    if (dataToExport.length === 0) return

    // 1. Define a strict order for common fields
    const priorityKeys = ['name', 'fullName', 'email', 'phone', 'phoneNumber']
    const blacklistedKeys = ['createdAt', 'id', 'formType'] // Already handled or unnecessary

    // 2. Identify all unique keys present in the fullData
    const otherKeys = new Set<string>()
    dataToExport.forEach(s => {
      Object.keys(s.fullData).forEach(key => {
        if (!priorityKeys.includes(key) && !blacklistedKeys.includes(key)) {
          otherKeys.add(key)
        }
      })
    })

    // 3. Finalize the Header sequence
    // This ensures Name/Email/Phone are always the first few columns
    const finalHeaders = [
      'Submission_ID', 
      'Form_Type', 
      'Date_Created', 
      ...priorityKeys.filter(k => dataToExport.some(s => s.fullData[k] !== undefined)), 
      ...Array.from(otherKeys)
    ]

    // 4. Construct CSV Rows with strict mapping to the header
    const csvRows = dataToExport.map(s => {
      const date = s.createdAt?.toDate?.() || new Date(s.createdAt)
      
      return finalHeaders.map(header => {
        let value: any = ''

        // Map data based on header name
        if (header === 'Submission_ID') value = s.id
        else if (header === 'Form_Type') value = s.formType
        else if (header === 'Date_Created') value = date.toLocaleString()
        else value = s.fullData[header] || ''

        // Sanitize string to prevent column shifting
        const sanitized = String(value)
          .replace(/\n/g, ' ') // Remove newlines
          .replace(/"/g, '""') // Escape quotes
        
        return `"${sanitized}"`
      }).join(',')
    })

    // 5. Download
    const csvContent = [finalHeaders.join(','), ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `submissions_${filterType}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredSubmissions = filterType === 'all' 
    ? submissions 
    : submissions.filter(s => s.formType === filterType)

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedSubmissions = filteredSubmissions.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const formTypeInfo = {
    contact: { label: 'Contact Message', color: '#7fff00' },
    consultation: { label: 'Consultation', color: '#1181EA' },
    mentorship: { label: 'Mentorship App', color: '#a855f7' },
  }

  return (
    <div style={{ background: isDark ? '#0a0a0a' : '#f5f5f3', minHeight: '100vh' }}>
      <div
        className="border-b"
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          borderColor: isDark ? '#1e1e1e' : '#e0e0e0',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center gap-2 text-sm mb-4"
                style={{ color: '#7fff00' }}
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                All Submissions
              </h1>
              <p className="text-sm mt-1" style={{ color: isDark ? '#888' : '#666' }}>
                Total: {filteredSubmissions.length} submissions
              </p>
            </div>
            
            <button
              onClick={handleExport}
              disabled={filteredSubmissions.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              style={{
                background: '#7fff00',
                color: '#000',
              }}
            >
              <Download size={16} />
              Export {filterType === 'all' ? 'All' : filterType} Data to CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div
            className="rounded-xl p-4 border mb-8 text-sm"
            style={{
              background: 'rgba(255, 59, 48, 0.1)',
              borderColor: 'rgba(255, 59, 48, 0.3)',
              color: '#ff3b30',
            }}
          >
            {error}
          </div>
        )}

        <div
          className="rounded-xl p-4 border mb-6 flex items-center justify-between flex-wrap gap-4"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            borderColor: isDark ? '#1e1e1e' : '#e0e0e0',
          }}
        >
          <div className="flex items-center gap-2">
            <Filter size={16} style={{ color: isDark ? '#888' : '#666' }} />
            <p className="text-sm font-medium" style={{ color: isDark ? '#ccc' : '#333' }}>
              Filter by Type:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'contact', 'consultation', 'mentorship'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFilterType(type)
                  setCurrentPage(1)
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filterType === type ? '#7fff00' : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  color: filterType === type ? '#000' : isDark ? '#ccc' : '#333',
                  border: `1px solid ${filterType === type ? '#7fff00' : isDark ? '#2a2a2a' : '#d8d8d8'}`,
                }}
              >
                {type === 'all' ? 'All' : formTypeInfo[type].label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: '#7fff00' }} />
              <p style={{ color: isDark ? '#888' : '#666' }}>Loading submissions...</p>
            </div>
          </div>
        ) : paginatedSubmissions.length === 0 ? (
          <div
            className="rounded-xl p-8 border text-center"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: isDark ? '#1e1e1e' : '#e0e0e0',
            }}
          >
            <p style={{ color: isDark ? '#888' : '#666' }}>No submissions found</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: isDark ? '#1e1e1e' : '#e0e0e0',
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        borderBottom: `1px solid ${isDark ? '#1e1e1e' : '#e0e0e0'}`,
                      }}
                    >
                      <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: isDark ? '#888' : '#666' }}>Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: isDark ? '#888' : '#666' }}>Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: isDark ? '#888' : '#666' }}>Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: isDark ? '#888' : '#666' }}>Date</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold" style={{ color: isDark ? '#888' : '#666' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderColor: isDark ? '#1e1e1e' : '#e0e0e0' }} className="divide-y">
                    {paginatedSubmissions.map((submission) => {
                      const createdDate = submission.createdAt?.toDate?.() || new Date(submission.createdAt)
                      const typeInfo = formTypeInfo[submission.formType]

                      return (
                        <tr key={submission.id}>
                          <td className="px-6 py-4 text-sm font-medium" style={{ color: isDark ? '#f0f0f0' : '#111' }}>{submission.name}</td>
                          <td className="px-6 py-4 text-sm" style={{ color: isDark ? '#aaa' : '#555' }}>{submission.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${typeInfo.color}22`, color: typeInfo.color }}>
                              {typeInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: isDark ? '#aaa' : '#555' }}>
                            {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => navigate(`/admin/submissions/${submission.id}?type=${submission.formType}`)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                              style={{ background: isDark ? 'rgba(127, 255, 0, 0.08)' : 'rgba(127, 255, 0, 0.05)', color: '#7fff00' }}
                            >
                              <ExternalLink size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p style={{ color: isDark ? '#888' : '#666' }} className="text-sm">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    style={{ background: isDark ? 'rgba(127, 255, 0, 0.08)' : 'rgba(127, 255, 0, 0.05)', color: '#7fff00', border: '1px solid rgba(127, 255, 0, 0.2)' }}
                  >Previous</button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    style={{ background: isDark ? 'rgba(127, 255, 0, 0.08)' : 'rgba(127, 255, 0, 0.05)', color: '#7fff00', border: '1px solid rgba(127, 255, 0, 0.2)' }}
                  >Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}