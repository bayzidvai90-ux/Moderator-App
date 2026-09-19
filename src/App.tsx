/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';

export default function App() {
  useEffect(() => {
    // Handle Android Back Button
    const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        // If there's no web history, we could either minimize the app or prompt to exit
        // For now, we'll exit to follow standard app behavior
        CapacitorApp.exitApp();
      } else {
        // Go back in webview history
        window.history.back();
      }
    });

    // Cleanup listener on unmount
    return () => {
      backButtonListener.then(l => l.remove());
    };
  }, []);

  return (
    <div className="app">
      <aside className="sidebar" id="sidebar">
        <div className="brand">
          BANGLA TUR <span style={{ color: 'var(--accent)' }}>BD</span>
          <small>MODERATOR CONTROL</small>
        </div>
        <div className="nav">
          <button className="active" data-page="dashboard"><i className="fa-solid fa-chart-line"></i> Dashboard</button>
          <button data-page="matches"><i className="fa-solid fa-gamepad"></i> Matches</button>
          <button data-page="categories"><i className="fa-solid fa-layer-group"></i> Categories</button>
          <button data-page="upcoming"><i className="fa-solid fa-clock"></i> Upcoming Matches</button>
          <button data-page="banners"><i className="fa-solid fa-images"></i> Banners</button>
          <button data-page="social"><i className="fa-solid fa-share-nodes"></i> Manage Social Media</button>
          <button data-page="notices"><i className="fa-solid fa-bell"></i> Notices</button>
          <button data-page="users"><i className="fa-solid fa-users"></i> Users</button>
          <button data-page="addbalance"><i className="fa-solid fa-wallet"></i> Add User Balance</button>
          <button data-page="registrations"><i className="fa-solid fa-users-viewfinder"></i> Registrations</button>
          <button data-page="slotrequests"><i className="fa-solid fa-ticket"></i> Slot Requests</button>
          <button data-page="results"><i className="fa-solid fa-trophy"></i> Match Results</button>
          <button data-page="history"><i className="fa-solid fa-clock-rotate-left"></i> Moderator History</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn menuBtn" id="menuBtn"><i className="fa-solid fa-bars"></i></button>
            <div>
              <h1 id="pageTitle">Dashboard</h1>
              <p>Bangla Tur BD • Moderator Control Center</p>
            </div>
          </div>
          <div className="actions">
            <button className="btn" onClick={() => window.refreshAll()}><i className="fa-solid fa-rotate"></i></button>
          </div>
        </div>

        <section className="page active" id="page-dashboard">
          <div className="hero-card">
            <div className="hero-logo"><span>BT</span></div>
            <div>
              <div className="eyebrow">BANGLA TUR BD</div>
              <h2>Welcome Back, Moderator!</h2>
              <p>Manage your tournament platform from one place.</p>
            </div>
            <div className="hero-chip"><i className="fa-solid fa-shield-halved"></i> MODERATOR</div>
          </div>
          <div className="section-title"><h2>Overview</h2><span>Live Firebase data</span></div>
          <div className="grid overview-grid">
            <div className="stat"><i className="fa-solid fa-users"></i><b id="sUsers">0</b><span>TOTAL USERS</span></div>
            <div className="stat"><i className="fa-solid fa-gamepad"></i><b id="sMatches">0</b><span>TOTAL MATCHES</span></div>
            <div className="stat"><i className="fa-solid fa-user-check"></i><b id="sRegs">0</b><span>REGISTRATIONS</span></div>
            <div className="stat"><i className="fa-solid fa-ticket"></i><b id="sSlots">0</b><span>PENDING SLOTS</span></div>
            <div className="stat"><i className="fa-solid fa-bullhorn"></i><b id="sDeposits">0</b><span>NOTICES</span></div>
            <div className="stat"><i className="fa-solid fa-images"></i><b id="sWithdrawals">0</b><span>BANNERS</span></div>
            <div className="stat"><i className="fa-solid fa-trophy"></i><b id="sCats">0</b><span>RESULTS</span></div>
            <div className="stat"><i className="fa-solid fa-circle-check"></i><b id="sMaintenance">READY</b><span>SYSTEM STATUS</span></div>
          </div>
          <div className="panel quick-panel">
            <div className="panel-head">
              <div><h2>Quick Actions</h2><p>Common moderator controls</p></div>
            </div>
            <div className="quick-grid">
              <button className="quick-tile" onClick={() => window.openEditor('match')}><span><i className="fa-solid fa-plus"></i></span><b>Add Match</b><small>Create / edit match</small></button>
              <button className="quick-tile" onClick={() => window.showPage('categories')}><span><i className="fa-solid fa-layer-group"></i></span><b>Categories</b><small>Manage categories</small></button>
              <button className="quick-tile" onClick={() => window.showPage('upcoming')}><span><i className="fa-solid fa-clock"></i></span><b>Upcoming Matches</b><small>Upcoming matches & banners</small></button>
              <button className="quick-tile" onClick={() => window.showPage('banners')}><span><i className="fa-solid fa-images"></i></span><b>Manage Banners</b><small>Homepage posters</small></button>
              <button className="quick-tile" onClick={() => window.showPage('notices')}><span><i className="fa-solid fa-bell"></i></span><b>Manage Notices</b><small>Announcements</small></button>
              <button className="quick-tile" onClick={() => window.showPage('social')}><span><i className="fa-solid fa-share-nodes"></i></span><b>Social Media</b><small>Update social links</small></button>
              <button className="quick-tile" onClick={() => window.showPage('registrations')}><span><i className="fa-solid fa-users-viewfinder"></i></span><b>Registrations</b><small>Approve / reject</small></button>
              <button className="quick-tile" onClick={() => window.showPage('slotrequests')}><span><i className="fa-solid fa-ticket"></i></span><b>Slot Requests</b><small>Review requests</small></button>
              <button className="quick-tile" onClick={() => window.showPage('results')}><span><i className="fa-solid fa-trophy"></i></span><b>Match Results</b><small>Publish results</small></button>
              <button className="quick-tile" onClick={() => window.showPage('users')}><span><i className="fa-solid fa-users"></i></span><b>Users</b><small>View / search</small></button>
              <button className="quick-tile" onClick={() => window.showPage('addbalance')}><span><i className="fa-solid fa-wallet"></i></span><b>Add Balance</b><small>UID / Gmail → Wallet</small></button>
            </div>
            <div className="moderator-note">
              <i className="fa-solid fa-shield-halved"></i>
              <div><b>Moderator access</b><p>Match, banner, notice, registration, slot-request and result controls work directly with Firebase. User data is view/search only; balance can be added from Add User Balance.</p></div>
            </div>
          </div>
        </section>

        <section className="page" id="page-categories">
          <div className="panel">
            <div className="panel-head"><h2>Categories</h2><button className="btn primary" onClick={() => window.openEditor('category')}>+ Add Category</button></div>
            <div id="categoriesList" className="card-list"></div>
          </div>
        </section>

        <section className="page" id="page-upcoming">
          <div className="panel">
            <div className="panel-head"><h2>Upcoming Matches</h2><button className="btn primary" onClick={() => window.openEditor('upcoming')}>+ Add Upcoming</button></div>
            <div id="upcomingList" className="card-list"></div>
          </div>
          <div className="panel">
            <div className="panel-head"><h2>Upcoming Banners</h2><button className="btn primary" onClick={() => window.openUpcomingBannerEditor()}>+ Add Upcoming Banner</button></div>
            <div id="upcomingBannersList" className="card-list"></div>
          </div>
        </section>

        <section className="page" id="page-matches">
          <div className="panel">
            <div className="panel-head">
              <h2>Matches</h2>
              <div className="actions">
                <input id="matchSearch" className="search" placeholder="Search matches..." />
                <button className="btn primary" onClick={() => window.openEditor('match')}>+ Add Match</button>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Category</th>
                    <th>Date / Time</th>
                    <th>Prize</th>
                    <th>Entry</th>
                    <th>Slots</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="matchesList"></tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="page" id="page-banners">
          <div className="panel">
            <div className="panel-head"><h2>Poster Carousel Banners</h2><button className="btn primary" onClick={() => window.openEditor('banner')}>+ Add Banner</button></div>
            <div id="bannersList" className="card-list"></div>
          </div>
        </section>

        <section className="page" id="page-social">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2>Manage Social Media</h2>
                <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '4px' }}>User Website-এর social icons এখান থেকে control করুন</div>
              </div>
              <button className="btn primary" onClick={() => window.saveSocialMedia()}><i className="fa-solid fa-floppy-disk"></i> Save Changes</button>
            </div>
            <div className="social-admin" style={{ marginTop: 0 }}>
              <h3><i className="fa-solid fa-share-nodes"></i> Social Media Links</h3>
              <div className="formgrid">
                <div className="field"><label><i className="fab fa-whatsapp"></i> WhatsApp Link</label><input id="modWhatsapp" placeholder="https://wa.me/8801..." type="url" /></div>
                <div className="field"><label><i className="fab fa-tiktok"></i> TikTok Link</label><input id="modTiktok" placeholder="https://www.tiktok.com/@..." type="url" /></div>
                <div className="field"><label><i className="fab fa-facebook"></i> Facebook Link</label><input id="modFacebook" placeholder="https://www.facebook.com/..." type="url" /></div>
                <div className="field"><label><i className="fab fa-youtube"></i> YouTube Link</label><input id="modYoutube" placeholder="https://www.youtube.com/@..." type="url" /></div>
                <div className="field"><label><i className="fab fa-telegram"></i> Telegram Link</label><input id="modTelegram" placeholder="https://t.me/..." type="url" /></div>
                <div className="field"><label><i className="fab fa-facebook-messenger"></i> Messenger Link</label><input id="modMessenger" placeholder="https://m.me/..." type="url" /></div>
              </div>
              <div className="social-admin-note">Link দিলে User Website-এ সেই social icon দেখাবে। কোনো link খালি রাখলে সেই icon দেখাবে না। Save Changes চাপলে Firebase-এর existing <b>appSettings.socialLinks</b>-এ update হবে।</div>
            </div>
          </div>
        </section>

        <section className="page" id="page-users">
          <div className="panel">
            <div className="panel-head"><h2>Users</h2><input id="userSearch" className="search" placeholder="Name / email / UID" /></div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>User</th><th>Email</th><th>Custom ID</th><th>Wallet</th><th>NW Wallet</th><th>Ban</th><th>Action</th></tr>
                </thead>
                <tbody id="usersList"></tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="page" id="page-addbalance">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2><i className="fa-solid fa-wallet" style={{ color: 'var(--accent)' }}></i> Add User Balance</h2>
                <p style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '4px' }}>User UID অথবা Gmail দিয়ে wallet balance যোগ করুন</p>
              </div>
            </div>
            <div className="formgrid">
              <div className="field full"><label>User UID / Gmail</label><input id="balanceUserKey" placeholder="e.g. user UID or user@gmail.com" autoComplete="off" /></div>
              <div className="field"><label>Amount (৳)</label><input id="balanceAmount" type="number" min="1" step="1" placeholder="e.g. 100" /></div>
              <div className="field"><label>Note (Optional)</label><input id="balanceNote" placeholder="Moderator added balance" /></div>
            </div>
            <div className="actions" style={{ marginTop: '14px' }}>
              <button className="btn primary" onClick={() => window.previewBalanceUser()}><i className="fa-solid fa-user-check"></i> Find User</button>
              <button className="btn green" onClick={() => window.addUserBalance()}><i className="fa-solid fa-plus"></i> Add Balance</button>
              <button className="btn" onClick={() => window.clearBalanceForm()}>Clear</button>
            </div>
            <div id="balanceUserPreview" style={{ marginTop: '14px' }}></div>
            <div className="danger-note" style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}>
              <i className="fa-solid fa-circle-info"></i> Balance যোগ করলে User-এর <b>wallet/balance</b>-এ amount যোগ হবে এবং wallet history-তে Moderator transaction তৈরি হবে।
            </div>
          </div>
        </section>

        <section className="page" id="page-registrations">
          <div className="panel">
            <div className="panel-head"><h2>Registrations</h2><input id="regSearch" className="search" placeholder="Team / UID / match" /></div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Match</th><th>Team</th><th>Player</th><th>UID</th><th>Status</th><th>Time</th><th>Action</th></tr>
                </thead>
                <tbody id="regsList"></tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="page" id="page-slotrequests">
          <div className="panel">
            <div className="panel-head"><h2>Slot Requests</h2><button className="btn" onClick={() => window.loadAll()}>Refresh</button></div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>User</th><th>Team</th><th>Players</th><th>Amount</th><th>Trx</th><th>Matches</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody id="slotList"></tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="page" id="page-notices">
          <div className="panel">
            <div className="panel-head"><h2>Notices</h2><button className="btn primary" onClick={() => window.openNoticeEditor()}>+ Add Notice</button></div>
            <div id="moderatorNotices" className="card-list"></div>
          </div>
        </section>

        <section className="page" id="page-results">
          <div className="panel">
            <div className="panel-head"><h2>Match Results</h2><button className="btn primary" onClick={() => window.openResultEditor()}>+ Add / Update Result</button></div>
            <div id="moderatorResults" className="card-list"></div>
          </div>
        </section>

        <section className="page" id="page-history">
          <div className="panel">
            <div className="panel-head">
              <div><h2>Moderator History</h2><p>Moderator-এর করা action-এর record</p></div>
              <button className="btn" onClick={() => window.loadAll()}><i className="fa-solid fa-rotate"></i> Refresh</button>
            </div>
            <div id="moderatorHistory" className="card-list"></div>
          </div>
        </section>
      </main>

      <nav className="mobile-bottom" id="mobileBottom">
        <button className="active" data-mob="dashboard"><i className="fa-solid fa-house"></i><span>Home</span></button>
        <button data-mob="matches"><i className="fa-solid fa-gamepad"></i><span>Matches</span></button>
        <button data-mob="addbalance"><i className="fa-solid fa-wallet"></i><span>Add Balance</span></button>
        <button data-mob="notices"><i className="fa-solid fa-bell"></i><span>Notices</span></button>
        <button data-mob="social"><i className="fa-solid fa-share-nodes"></i><span>More</span></button>
      </nav>

      <div id="modalRoot"></div>
      <div className="toast" id="toast"></div>
    </div>
  );
}
