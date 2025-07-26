import React, { useState, useEffect } from 'react';

const MyDaPaintSales = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    value: '',
    status: 'cold',
    notes: ''
  });

  // Mock data - In real app, this would come from API
  const salesData = {
    thisMonth: {
      revenue: 247500,
      deals: 15,
      conversion: 23.5,
      avgDealSize: 16500,
      pipeline: 890000,
      commission: 24750
    },
    thisWeek: {
      revenue: 62000,
      deals: 4,
      conversion: 28.6,
      avgDealSize: 15500,
      pipeline: 245000,
      commission: 6200
    },
    today: {
      revenue: 18500,
      deals: 1,
      conversion: 33.3,
      avgDealSize: 18500,
      pipeline: 67000,
      commission: 1850
    }
  };

  const leads = [
    { id: 1, name: 'Marcus Johnson', email: 'marcus@corp.com', value: 45000, status: 'hot', lastContact: '2 hours ago', source: 'Referral' },
    { id: 2, name: 'Sarah Chen', email: 'sarah@tech.io', value: 28000, status: 'warm', lastContact: '1 day ago', source: 'LinkedIn' },
    { id: 3, name: 'David Rodriguez', email: 'david@startup.co', value: 67000, status: 'hot', lastContact: '4 hours ago', source: 'Cold Call' },
    { id: 4, name: 'Emily Parker', email: 'emily@finance.com', value: 34000, status: 'cold', lastContact: '3 days ago', source: 'Website' },
    { id: 5, name: 'Michael Brown', email: 'mike@enterprise.net', value: 89000, status: 'closing', lastContact: '30 min ago', source: 'Referral' }
  ];

  const teamUpdates = [
    { id: 1, user: 'Alex Rivera', action: 'closed deal', value: '$45K', time: '2 hours ago', type: 'success' },
    { id: 2, user: 'Jordan Kim', action: 'shared strategy', content: 'Enterprise objection handling', time: '4 hours ago', type: 'knowledge' },
    { id: 3, user: 'Taylor Smith', action: 'added hot lead', value: '$67K', time: '6 hours ago', type: 'lead' },
    { id: 4, user: 'Casey Johnson', action: 'hit monthly goal', value: '120% quota', time: '1 day ago', type: 'milestone' }
  ];

  const currentData = salesData[timeRange];

  const handleAddLead = (e) => {
    e.preventDefault();
    // In real app, would save to API
    console.log('Adding lead:', newLead);
    setShowLeadModal(false);
    setNewLead({ name: '', email: '', phone: '', source: '', value: '', status: 'cold', notes: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hot': return '#ff4444';
      case 'warm': return '#ffaa00';
      case 'closing': return '#00ff00';
      default: return '#666';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>💎 High-Ticket Sales Command Center</h1>
          <p style={styles.subtitle}>Drive revenue. Close deals. Dominate the market.</p>
        </div>
        <div style={styles.headerRight}>
          <select 
            style={styles.timeSelect}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>

      <div style={styles.tabContainer}>
        {['dashboard', 'leads', 'team', 'knowledge'].map(tab => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'dashboard' && '📊 Dashboard'}
            {tab === 'leads' && '🎯 Lead Pipeline'}
            {tab === 'team' && '👥 Team Feed'}
            {tab === 'knowledge' && '🧠 Sales Intel'}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div style={styles.content}>
          {/* KPI Cards */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Revenue</span>
                <span style={styles.kpiIcon}>💰</span>
              </div>
              <div style={styles.kpiValue}>{formatCurrency(currentData.revenue)}</div>
              <div style={styles.kpiGrowth}>+24% vs last period</div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Deals Closed</span>
                <span style={styles.kpiIcon}>🤝</span>
              </div>
              <div style={styles.kpiValue}>{currentData.deals}</div>
              <div style={styles.kpiGrowth}>+12% vs last period</div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Conversion Rate</span>
                <span style={styles.kpiIcon}>📈</span>
              </div>
              <div style={styles.kpiValue}>{currentData.conversion}%</div>
              <div style={styles.kpiGrowth}>+5.2% vs last period</div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Avg Deal Size</span>
                <span style={styles.kpiIcon}>💎</span>
              </div>
              <div style={styles.kpiValue}>{formatCurrency(currentData.avgDealSize)}</div>
              <div style={styles.kpiGrowth}>+8% vs last period</div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Pipeline Value</span>
                <span style={styles.kpiIcon}>🔥</span>
              </div>
              <div style={styles.kpiValue}>{formatCurrency(currentData.pipeline)}</div>
              <div style={styles.kpiGrowth}>+18% vs last period</div>
            </div>

            <div style={{...styles.kpiCard, ...styles.commissionCard}}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Your Commission</span>
                <span style={styles.kpiIcon}>🏆</span>
              </div>
              <div style={styles.kpiValue}>{formatCurrency(currentData.commission)}</div>
              <div style={styles.kpiGrowth}>💸 Keep crushing it!</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <button style={styles.actionBtn} onClick={() => setShowLeadModal(true)}>
              ➕ Add Hot Lead
            </button>
            <button style={styles.actionBtn}>
              📞 Log Call
            </button>
            <button style={styles.actionBtn}>
              📧 Send Follow-up
            </button>
            <button style={styles.actionBtn}>
              📊 Update Deal
            </button>
          </div>

          {/* Recent Activity */}
          <div style={styles.activitySection}>
            <h3 style={styles.sectionTitle}>🔥 Recent Wins & Activity</h3>
            <div style={styles.activityList}>
              {teamUpdates.slice(0, 3).map(update => (
                <div key={update.id} style={styles.activityItem}>
                  <div style={styles.activityIcon}>
                    {update.type === 'success' && '🎉'}
                    {update.type === 'knowledge' && '💡'}
                    {update.type === 'lead' && '🎯'}
                    {update.type === 'milestone' && '🏆'}
                  </div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityText}>
                      <strong>{update.user}</strong> {update.action} 
                      {update.value && <span style={styles.activityValue}>{update.value}</span>}
                    </div>
                    <div style={styles.activityTime}>{update.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div style={styles.content}>
          <div style={styles.leadsHeader}>
            <h3 style={styles.sectionTitle}>🎯 Your Lead Pipeline</h3>
            <button style={styles.addLeadBtn} onClick={() => setShowLeadModal(true)}>
              ➕ Add New Lead
            </button>
          </div>

          <div style={styles.leadsGrid}>
            {leads.map(lead => (
              <div key={lead.id} style={styles.leadCard}>
                <div style={styles.leadHeader}>
                  <div style={styles.leadName}>{lead.name}</div>
                  <div 
                    style={{
                      ...styles.leadStatus,
                      backgroundColor: getStatusColor(lead.status)
                    }}
                  >
                    {lead.status.toUpperCase()}
                  </div>
                </div>
                <div style={styles.leadValue}>{formatCurrency(lead.value)}</div>
                <div style={styles.leadDetails}>
                  <div>📧 {lead.email}</div>
                  <div>📍 {lead.source}</div>
                  <div>⏰ {lead.lastContact}</div>
                </div>
                <div style={styles.leadActions}>
                  <button style={styles.leadActionBtn}>📞 Call</button>
                  <button style={styles.leadActionBtn}>📧 Email</button>
                  <button style={styles.leadActionBtn}>📝 Note</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div style={styles.content}>
          <h3 style={styles.sectionTitle}>👥 Team Sales Feed</h3>
          <div style={styles.teamFeed}>
            {teamUpdates.map(update => (
              <div key={update.id} style={styles.teamUpdate}>
                <div style={styles.updateIcon}>
                  {update.type === 'success' && '🎉'}
                  {update.type === 'knowledge' && '💡'}
                  {update.type === 'lead' && '🎯'}
                  {update.type === 'milestone' && '🏆'}
                </div>
                <div style={styles.updateContent}>
                  <div style={styles.updateText}>
                    <strong>{update.user}</strong> {update.action}
                    {update.value && <span style={styles.updateValue}>{update.value}</span>}
                    {update.content && <div style={styles.updateDescription}>{update.content}</div>}
                  </div>
                  <div style={styles.updateTime}>{update.time}</div>
                </div>
                <div style={styles.updateActions}>
                  <button style={styles.updateActionBtn}>👍</button>
                  <button style={styles.updateActionBtn}>💬</button>
                  <button style={styles.updateActionBtn}>🔄</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div style={styles.content}>
          <h3 style={styles.sectionTitle}>🧠 Sales Intelligence Hub</h3>
          
          <div style={styles.knowledgeGrid}>
            <div style={styles.knowledgeCard}>
              <h4 style={styles.knowledgeTitle}>🔥 Hot Objection Handlers</h4>
              <div style={styles.knowledgeContent}>
                <div style={styles.objectionItem}>
                  <strong>"It's too expensive"</strong>
                  <p>"I understand price is important. Let me show you the ROI our top clients see in 90 days..."</p>
                </div>
                <div style={styles.objectionItem}>
                  <strong>"We need to think about it"</strong>
                  <p>"Absolutely, what specific concerns can I address right now to help with your decision?"</p>
                </div>
              </div>
            </div>

            <div style={styles.knowledgeCard}>
              <h4 style={styles.knowledgeTitle}>💎 Closing Techniques</h4>
              <div style={styles.knowledgeContent}>
                <div style={styles.techniqueItem}>
                  <strong>Assumptive Close:</strong>
                  <p>"When would you like to start seeing results?"</p>
                </div>
                <div style={styles.techniqueItem}>
                  <strong>Urgency Close:</strong>
                  <p>"This pricing is locked in through Friday..."</p>
                </div>
              </div>
            </div>

            <div style={styles.knowledgeCard}>
              <h4 style={styles.knowledgeTitle}>📊 Market Intelligence</h4>
              <div style={styles.knowledgeContent}>
                <div style={styles.marketItem}>
                  <strong>Enterprise Segment:</strong>
                  <p>Avg deal: $85K | Close rate: 34% | Cycle: 120 days</p>
                </div>
                <div style={styles.marketItem}>
                  <strong>Mid-Market:</strong>
                  <p>Avg deal: $45K | Close rate: 42% | Cycle: 60 days</p>
                </div>
              </div>
            </div>

            <div style={styles.knowledgeCard}>
              <h4 style={styles.knowledgeTitle}>🎯 This Week's Focus</h4>
              <div style={styles.knowledgeContent}>
                <div style={styles.focusItem}>✅ Follow up on warm leads from last week</div>
                <div style={styles.focusItem}>✅ Schedule 5 discovery calls</div>
                <div style={styles.focusItem}>✅ Close 2 deals in pipeline</div>
                <div style={styles.focusItem}>✅ Share 1 win story with team</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showLeadModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLeadModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🎯 Add New High-Value Lead</h3>
              <button style={styles.closeBtn} onClick={() => setShowLeadModal(false)}>✕</button>
            </div>
            <form style={styles.modalForm} onSubmit={handleAddLead}>
              <div style={styles.formRow}>
                <input
                  style={styles.formInput}
                  type="text"
                  placeholder="Full Name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  required
                />
                <input
                  style={styles.formInput}
                  type="email"
                  placeholder="Email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <input
                  style={styles.formInput}
                  type="tel"
                  placeholder="Phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                />
                <select
                  style={styles.formInput}
                  value={newLead.source}
                  onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                  required
                >
                  <option value="">Lead Source</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Website">Website</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div style={styles.formRow}>
                <input
                  style={styles.formInput}
                  type="number"
                  placeholder="Potential Value ($)"
                  value={newLead.value}
                  onChange={(e) => setNewLead({...newLead, value: e.target.value})}
                  required
                />
                <select
                  style={styles.formInput}
                  value={newLead.status}
                  onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                >
                  <option value="cold">Cold</option>
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                </select>
              </div>
              <textarea
                style={styles.formTextarea}
                placeholder="Notes (pain points, timeline, decision makers...)"
                value={newLead.notes}
                onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                rows="3"
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowLeadModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  🚀 Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    color: '#fff',
    padding: '20px',
    fontFamily: "'Anton', sans-serif"
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
    borderRadius: '15px',
    border: '1px solid #333'
  },

  headerLeft: {
    flex: 1
  },

  title: {
    fontSize: '28px',
    margin: 0,
    background: 'linear-gradient(45deg, #FEBF00, #FFD700)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    fontWeight: 'bold'
  },

  subtitle: {
    fontSize: '16px',
    color: '#ccc',
    margin: '5px 0 0 0'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center'
  },

  timeSelect: {
    background: '#333',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '8px',
    padding: '10px 15px',
    fontSize: '14px',
    outline: 'none'
  },

  tabContainer: {
    display: 'flex',
    marginBottom: '30px',
    background: '#1e1e1e',
    borderRadius: '12px',
    padding: '5px',
    border: '1px solid #333'
  },

  tab: {
    flex: 1,
    background: 'transparent',
    color: '#ccc',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  },

  activeTab: {
    background: '#FEBF00',
    color: '#000'
  },

  content: {
    animation: 'fadeIn 0.5s ease-in'
  },

  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },

  kpiCard: {
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid #333',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },

  commissionCard: {
    background: 'linear-gradient(135deg, #FEBF00 0%, #FFD700 100%)',
    color: '#000'
  },

  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },

  kpiLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },

  kpiIcon: {
    fontSize: '24px'
  },

  kpiValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },

  kpiGrowth: {
    fontSize: '12px',
    color: '#4CAF50',
    fontWeight: 'bold'
  },

  quickActions: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },

  actionBtn: {
    background: 'linear-gradient(135deg, #FEBF00 0%, #FFD700 100%)',
    color: '#000',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  },

  activitySection: {
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid #333'
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#FEBF00'
  },

  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },

  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#1a1a1a',
    borderRadius: '10px',
    border: '1px solid #333'
  },

  activityIcon: {
    fontSize: '24px'
  },

  activityContent: {
    flex: 1
  },

  activityText: {
    fontSize: '14px',
    marginBottom: '5px'
  },

  activityValue: {
    color: '#FEBF00',
    fontWeight: 'bold',
    marginLeft: '5px'
  },

  activityTime: {
    fontSize: '12px',
    color: '#888'
  },

  leadsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },

  addLeadBtn: {
    background: 'linear-gradient(135deg, #FEBF00 0%, #FFD700 100%)',
    color: '#000',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  leadsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },

  leadCard: {
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #333'
  },

  leadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },

  leadName: {
    fontSize: '16px',
    fontWeight: 'bold'
  },

  leadStatus: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase'
  },

  leadValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FEBF00',
    marginBottom: '15px'
  },

  leadDetails: {
    fontSize: '12px',
    color: '#ccc',
    marginBottom: '15px',
    lineHeight: '1.5'
  },

  leadActions: {
    display: 'flex',
    gap: '10px'
  },

  leadActionBtn: {
    background: '#333',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer'
  },

  teamFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  teamUpdate: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
    borderRadius: '15px',
    border: '1px solid #333'
  },

  updateIcon: {
    fontSize: '32px'
  },

  updateContent: {
    flex: 1
  },

  updateText: {
    fontSize: '14px',
    marginBottom: '5px'
  },

  updateValue: {
    color: '#FEBF00',
    fontWeight: 'bold',
    marginLeft: '5px'
  },

  updateDescription: {
    fontSize: '12px',
    color: '#aaa',
    marginTop: '5px'
  },

  updateTime: {
    fontSize: '12px',
    color: '#888'
  },

  updateActions: {
    display: 'flex',
    gap: '10px'
  },

  updateActionBtn: {
    background: '#333',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
  },

  knowledgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px'
  },

  knowledgeCard: {
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid #333'
  },

  knowledgeTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#FEBF00'
  },

  knowledgeContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },

  objectionItem: {
    padding: '15px',
    background: '#1a1a1a',
    borderRadius: '10px',
    border: '1px solid #333'
  },

  techniqueItem: {
    padding: '15px',
    background: '#1a1a1a',
    borderRadius: '10px',
    border: '1px solid #333'
  },

  marketItem: {
    padding: '15px',
    background: '#1a1a1a',
    borderRadius: '10px',
    border: '1px solid #333'
  },

  focusItem: {
    padding: '12px 15px',
    background: '#1a1a1a',
    borderRadius: '8px',
    border: '1px solid #333',
    fontSize: '14px'
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },

  modalContent: {
    background: '#1e1e1e',
    borderRadius: '15px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #333'
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px',
    borderBottom: '1px solid #333'
  },

  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FEBF00',
    margin: 0
  },

  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#ccc',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    width: '30px',
    height: '30px'
  },

  modalForm: {
    padding: '25px'
  },

  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },

  formInput: {
    flex: 1,
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '8px',
    background: '#2a2a2a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },

  formTextarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '8px',
    background: '#2a2a2a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '20px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },

  modalActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end'
  },

  cancelBtn: {
    padding: '12px 24px',
    border: '1px solid #666',
    borderRadius: '8px',
    background: 'transparent',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '14px'
  },

  submitBtn: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #FEBF00 0%, #FFD700 100%)',
    color: '#000',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default MyDaPaintSales;
