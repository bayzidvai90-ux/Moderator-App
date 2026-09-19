import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize the root component
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// --- Provided JavaScript Logic from Source of Truth HTML ---
// We keep the exact logic to ensure Firebase integration remains identical.

const firebaseConfig = {
  apiKey: "AIzaSyAXDZLhIJyR1_ZAnPFIoTNatgHeUB_izVY",
  authDomain: "bangla-tur.firebaseapp.com",
  databaseURL: "https://bangla-tur-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "bangla-tur",
  storageBucket: "bangla-tur.firebasestorage.app",
  messagingSenderId: "63847086538",
  appId: "1:63847086538:web:09b8369f5a21673c2b3733"
};

// Initialize Firebase if not already initialized
if (!window.firebase.apps.length) {
  window.firebase.initializeApp(firebaseConfig);
}
const db = window.firebase.database();
window.db = db;

window.DATA = {
  settings: {},
  categories: {},
  matches: {},
  banners: {},
  upcomingBanners: {},
  users: {},
  deposits: {},
  withdrawals: {},
  registrations: {},
  slotRequests: {},
  notices: {},
  moderatorHistory: {}
};
window.editing = null;

const $ = (id: string) => document.getElementById(id);
const esc = (v: any) => String(v ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' } as any)[m]);
const money = (v: any) => `৳${Number(v || 0).toLocaleString()}`;
const time = (v: any) => v ? new Date(Number(v)).toLocaleString() : '—';

window.showPage = (p: string) => {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.nav button').forEach(x => x.classList.remove('active'));
  const targetPage = $('page-' + p);
  if (targetPage) targetPage.classList.add('active');
  const navBtn = document.querySelector(`.nav button[data-page="${p}"]`);
  if (navBtn) navBtn.classList.add('active');
  const pageTitle = $('pageTitle');
  if (pageTitle) pageTitle.textContent = (navBtn as HTMLElement)?.innerText.trim() || 'Admin';
  $('sidebar')?.classList.remove('open');
};

const toast = (msg: string) => {
  const t = $('toast');
  if (t) {
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { if (t) t.style.display = 'none' }, 2200);
  }
};

const confirmBox = (title: string, text = 'এই কাজটি করবেন?') => {
  return window.Swal.fire({
    title,
    text,
    icon: 'warning',
    background: '#fff',
    color: '#102a56',
    showCancelButton: true,
    confirmButtonColor: '#1769e0',
    cancelButtonColor: '#374151'
  }).then((r: any) => r.isConfirmed);
};

window.refreshAll = async () => {
  await window.loadAll();
  toast('Data refreshed');
};

window.loadAll = async () => {
  const paths = Object.keys(window.DATA).filter(p => p !== 'banners');
  await Promise.all(paths.map(async p => {
    const s = await db.ref(p === 'deposits' ? 'deposit_requests' : p === 'slotRequests' ? 'slot_requests' : p).once('value');
    window.DATA[p] = s.val() || {};
  }));
  const bannerSnap = await db.ref('appSettings/banners').once('value');
  window.DATA.banners = bannerSnap.val() || {};
  const upcomingBannerSnap = await db.ref('appSettings/upcomingBanners').once('value');
  window.DATA.upcomingBanners = upcomingBannerSnap.val() || {};

  window.renderDashboard();
  window.renderCategories();
  window.renderMatches();
  window.renderUpcoming();
  window.renderBanners();
  window.renderUpcomingBanners();
  window.renderUsers();
  window.renderDeposits();
  window.renderWithdrawals();
  window.renderRegistrations();
  window.renderSlotRequests();
  // Settings fills
  fillSettings();
  fillModeratorSocial();
  window.renderModeratorNotices();
  window.renderModeratorResults();
};

function fillSettings() {
  const s = window.DATA.settings || {};
  const elMap: any = {
    'stDailyLogo': s.dailyLogo || '',
    'stChampLogo': s.champLogo || '',
    'stSupport': s.supportNumber || s.whatsappNumber || '',
    'stMaintenance': String(!!s.maintenanceMode),
    'stBkash': s.bkashNumber || s.bKashNumber || '',
    'stNagad': s.nagadNumber || '',
    'stRocket': s.rocketNumber || '',
    'stPayNote': s.paymentInstructions || s.paymentNote || '',
    'stWelcomeEnabled': String(!!s.welcomePopup?.enabled),
    'stWelcomeTitle': s.welcomePopup?.title || '',
    'stWelcomeMessage': s.welcomePopup?.message || '',
    'stWelcomeImage': s.welcomePopup?.image || '',
    'stWhatsapp': s.socialLinks?.whatsapp || '',
    'stTiktok': s.socialLinks?.tiktok || '',
    'stFacebook': s.socialLinks?.facebook || '',
    'stYoutube': s.socialLinks?.youtube || '',
    'stTelegram': s.socialLinks?.telegram || '',
    'stMessenger': s.socialLinks?.messenger || ''
  };
  Object.keys(elMap).forEach(id => {
    const el = $(id) as HTMLInputElement;
    if (el) el.value = elMap[id];
  });
}

function fillModeratorSocial() {
  const s = (window.DATA.settings || {}).socialLinks || {};
  const elMap: any = {
    'modWhatsapp': s.whatsapp || '',
    'modTiktok': s.tiktok || '',
    'modFacebook': s.facebook || '',
    'modYoutube': s.youtube || '',
    'modTelegram': s.telegram || '',
    'modMessenger': s.messenger || ''
  };
  Object.keys(elMap).forEach(id => {
    const el = $(id) as HTMLInputElement;
    if (el) el.value = elMap[id];
  });
}

function countRegs() {
  let n = 0;
  Object.values(window.DATA.registrations || {}).forEach((x: any) => n += Object.keys(x || {}).length);
  return n;
}

window.renderDashboard = () => {
  const elMap: any = {
    'sUsers': Object.keys(window.DATA.users || {}).length,
    'sMatches': Object.keys(window.DATA.matches || {}).length,
    'sRegs': countRegs(),
    'sSlots': Object.values(window.DATA.slotRequests || {}).filter((x: any) => x?.status === 'Pending').length,
    'sDeposits': Object.keys(window.DATA.notices || {}).length,
    'sWithdrawals': Object.keys(window.DATA.banners || {}).length,
    'sCats': Object.values(window.DATA.matches || {}).filter((m: any) => m?.result || m?.results || String(m?.status || '').toLowerCase() === 'completed').length,
    'sMaintenance': 'READY'
  };
  Object.keys(elMap).forEach(id => {
    const el = $(id);
    if (el) el.textContent = String(elMap[id]);
  });
};

window.renderCategories = () => {
  const arr = Object.entries(window.DATA.categories);
  const list = $('categoriesList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, c]: any) => `
      <div class="item">
        <div class="item-left">
          <img class="thumb" src="${esc(c.logo || 'https://placehold.co/100x70/1e283d/fff?text=CAT')}" onerror="this.style.visibility='hidden'">
          <div class="item-main"><b>${esc(c.name || id)}</b><small>ID: ${esc(id)} ${c.notice ? ' • Notice set' : ''}</small></div>
        </div>
        <div class="actions">
          <button class="btn sm blue" onclick="window.openEditor('category','${esc(id)}')">Edit</button>
          <button class="btn sm red" onclick="window.removePath('categories/${esc(id)}','Category')">Delete</button>
        </div>
      </div>`).join('') : `<div class="empty">No categories found.</div>`;
  }
};

window.renderMatches = () => {
  const q = (($('matchSearch') as HTMLInputElement)?.value || '').toLowerCase();
  const arr = Object.entries(window.DATA.matches).filter(([id, m]: any) => `${id} ${m.category || ''} ${m.time || ''} ${m.map || ''}`.toLowerCase().includes(q));
  const list = $('matchesList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, m]: any) => `
      <tr>
        <td><strong>${esc(m.title || m.name || m.time || 'Match')}</strong><br><small>#${esc(id.slice(-5).toUpperCase())}</small></td>
        <td>${esc(m.category || '')}</td>
        <td>${esc(m.date || '')}<br>${esc(m.time || '')}</td>
        <td>${money(m.prize)}</td>
        <td>${money(m.fee)}</td>
        <td>${Number(m.slots || 0)}/${Number(m.totalSlots || 0)}</td>
        <td><span class="badge ${m.isHidden ? 'hidden' : ''}">${m.isHidden ? 'HIDDEN' : esc(m.status || (m.isClosed ? 'CLOSED' : 'LIVE'))}</span></td>
        <td><div class="actions">
          <button class="btn sm blue" onclick="window.openEditor('match','${esc(id)}')">Edit</button>
          <button class="btn sm red" onclick="window.removePath('matches/${esc(id)}','Match')">Delete</button>
        </div></td>
      </tr>`).join('') : `<tr><td colspan="8" class="empty">No matches found.</td></tr>`;
  }
};

window.renderUpcoming = () => {
  const arr = Object.entries(window.DATA.matches || {}).filter(([id, m]: any) => String(m.status || '').toLowerCase() === 'upcoming');
  const list = $('upcomingList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, m]: any) => `
      <div class="item">
        <div class="item-main"><b>${esc(m.title || m.name || 'Upcoming Match')}</b><small>${esc(m.category || '')} • ${esc(m.date || '')} ${esc(m.time || '')} • Prize ${money(m.prize)} • Entry ${money(m.fee)}</small></div>
        <div class="actions"><button class="btn sm blue" onclick="window.openEditor('match','${esc(id)}')">Edit</button></div>
      </div>`).join('') : '<div class="empty">No upcoming matches.</div>';
  }
};

window.renderBanners = () => {
  const arr = Object.entries(window.DATA.banners);
  const list = $('bannersList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, b]: any) => `
      <div class="item">
        <div class="item-left">
          <img class="thumb" src="${esc(b.image || '')}" onerror="this.style.visibility='hidden'">
          <div class="item-main"><b>Banner ${esc(id.slice(-5))}</b><small>${esc(b.link || 'No link')}</small></div>
        </div>
        <div class="actions">
          <button class="btn sm blue" onclick="window.openEditor('banner','${esc(id)}')">Edit</button>
          <button class="btn sm red" onclick="window.removePath('appSettings/banners/${esc(id)}','Banner')">Delete</button>
        </div>
      </div>`).join('') : `<div class="empty">No banners found.</div>`;
  }
};

window.renderUpcomingBanners = () => {
  const arr = Object.entries(window.DATA.upcomingBanners || {});
  const list = $('upcomingBannersList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, b]: any) => `
      <div class="item">
        <div class="item-left">
          <img class="thumb" src="${esc(b.image || '')}" onerror="this.style.visibility='hidden'">
          <div class="item-main"><b>Banner ${esc(id.slice(-5))}</b><small>${esc(b.matchId || b.match_id || b.matchKey || 'No Match ID')} • ${esc(b.link || 'No link')}</small></div>
        </div>
        <div class="actions">
          <button class="btn sm blue" onclick="window.openUpcomingBannerEditor('${esc(id)}')">Edit</button>
          <button class="btn sm red" onclick="window.removePath('appSettings/upcomingBanners/${esc(id)}','Upcoming Banner')">Delete</button>
        </div>
      </div>`).join('') : '<div class="empty">No upcoming banners found.</div>';
  }
};

window.renderUsers = () => {
  const q = (($('userSearch') as HTMLInputElement)?.value || '').toLowerCase();
  const arr = Object.entries(window.DATA.users).filter(([id, u]: any) => `${id} ${u.name || ''} ${u.email || ''} ${u.customId || ''}`.toLowerCase().includes(q));
  const list = $('usersList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, u]: any) => `
      <tr>
        <td><strong>${esc(u.name || 'User')}</strong><br><small>${esc(id)}</small></td>
        <td>${esc(u.email || '')}</td>
        <td>${esc(u.customId || 'N/A')}</td>
        <td>${money(u.wallet?.balance)}</td>
        <td>${money(u.wallet?.nonWithdrawableBalance)}</td>
        <td><span class="badge ${u.isBanned ? 'rejected' : 'approved'}">${u.isBanned ? 'BANNED' : 'ACTIVE'}</span></td>
        <td><button class="btn sm blue" onclick="window.openJson('users/${esc(id)}')">View</button></td>
      </tr>`).join('') : `<tr><td colspan="7" class="empty">No users found.</td></tr>`;
  }
};

window.renderDeposits = () => {
  const arr = Object.entries(window.DATA.deposits).sort((a: any, b: any) => (b[1]?.time || 0) - (a[1]?.time || 0));
  const list = $('depositList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, x]: any) => `
      <tr>
        <td><strong>${esc(x.name || 'User')}</strong><br><small>${esc(x.uid || '')}</small></td>
        <td>${money(x.amount)}</td>
        <td>${esc(x.method)}</td>
        <td>${esc(x.trxId)}</td>
        <td><span class="badge ${String(x.status).toLowerCase().includes('pending') ? 'pending' : x.status === 'Rejected' ? 'rejected' : 'approved'}">${esc(x.status)}</span></td>
        <td>${time(x.time)}</td>
        <td><div class="actions">
          ${x.status === 'Pending' ? `<button class="btn sm green" onclick="window.approveDeposit('${esc(id)}')">Approve</button><button class="btn sm red" onclick="window.rejectDepositRequest('${esc(id)}')">Reject</button>` : `<button class="btn sm blue" onclick="window.openJson('deposit_requests/${esc(id)}')">View</button>`}
        </div></td>
      </tr>`).join('') : `<tr><td colspan="7" class="empty">No deposit requests.</td></tr>`;
  }
};

window.approveDeposit = async (id: string) => {
  const x = window.DATA.deposits[id];
  if (!x) return toast('Deposit request not found');
  if (x.status !== 'Pending') return toast('This request is already resolved.');
  if (!(await confirmBox('Approve deposit?', `${money(x.amount)} → ${x.name || x.uid}`))) return;
  try {
    const fresh = await db.ref(`deposit_requests/${id}`).once('value');
    const req = fresh.val();
    if (!req) return window.Swal.fire({ icon: 'error', title: 'Request not found', background: '#fff', color: '#102a56' });
    if (req.status !== 'Pending') return window.Swal.fire({ icon: 'info', title: 'Already resolved', text: `Current status: ${req.status}`, background: '#fff', color: '#102a56' });
    const amount = Number(req.amount || 0);
    const uid = req.uid;
    if (!uid || !amount || amount <= 0) throw new Error('Invalid UID or amount in this deposit request.');
    const balRef = db.ref(`users/${uid}/wallet/balance`);
    const balSnap = await balRef.once('value');
    const old = Number(balSnap.val() || 0);
    await balRef.set(old + amount);
    await db.ref(`deposit_requests/${id}`).update({ status: 'Approved', approvedAt: Date.now(), approvedBy: 'Admin' });
    await db.ref(`users/${uid}/wallet/history`).push({ type: 'Add Money', amount: amount, time: Date.now(), status: 'Approved', trxId: req.trxId || '', requestId: id });
    await window.loadAll();
    toast('Deposit approved');
  } catch (e: any) {
    window.Swal.fire({ icon: 'error', title: 'Approval failed', text: e.message || String(e), background: '#fff', color: '#102a56' });
  }
};

window.rejectDepositRequest = async (id: string) => {
  const x = window.DATA.deposits[id];
  if (!x) return;
  if (String(x.status || '').toLowerCase() !== 'pending') return toast('This deposit is already resolved.');
  const r = await window.Swal.fire({ title: 'Reject deposit?', input: 'text', inputLabel: 'Reason (optional)', background: '#fff', color: '#102a56', showCancelButton: true, confirmButtonColor: '#ef4444' });
  if (!r.isConfirmed) return;
  await db.ref(`deposit_requests/${id}`).update({ status: 'Rejected', rejectedAt: Date.now(), rejectedBy: 'Admin', rejectReason: (r.value || '').trim() });
  await window.loadAll();
  toast('Deposit rejected');
};

window.renderWithdrawals = () => {
  const arr = Object.entries(window.DATA.withdrawals).sort((a: any, b: any) => (b[1]?.time || 0) - (a[1]?.time || 0));
  const list = $('withdrawList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, x]: any) => `
      <tr>
        <td><strong>${esc(x.name || 'User')}</strong><br><small>${esc(x.uid || '')}</small></td>
        <td>${money(x.amount)}</td>
        <td>${esc(x.method)}</td>
        <td>${esc(x.number)}</td>
        <td><span class="badge ${x.status === 'Pending' ? 'pending' : x.status === 'Rejected' ? 'rejected' : 'approved'}">${esc(x.status)}</span></td>
        <td>${time(x.time)}</td>
        <td><div class="actions">
          ${x.status === 'Pending' ? `<button class="btn sm green" onclick="window.approveWithdrawal('${esc(id)}')">Paid</button><button class="btn sm red" onclick="window.rejectWithdrawal('${esc(id)}')">Reject + Refund</button>` : ''}
          <button class="btn sm blue" onclick="window.openJson('withdrawals/${esc(id)}')">View</button>
        </div></td>
      </tr>`).join('') : `<tr><td colspan="7" class="empty">No withdrawals.</td></tr>`;
  }
};

window.approveWithdrawal = async (id: string) => {
  if (!(await confirmBox('Mark withdrawal as paid?'))) return;
  const x = window.DATA.withdrawals[id];
  await db.ref(`withdrawals/${id}`).update({ status: 'Completed', completedAt: Date.now() });
  await db.ref(`users/${x.uid}/wallet/history`).push({ type: 'Withdraw', amount: Number(x.amount || 0), time: Date.now(), status: 'Completed' });
  await window.loadAll();
  toast('Withdrawal marked paid');
};

window.rejectWithdrawal = async (id: string) => {
  const x = window.DATA.withdrawals[id];
  if (!(await confirmBox('Reject and refund?', `${money(x.amount)} will be returned.`))) return;
  const r = await db.ref(`users/${x.uid}/wallet/balance`).once('value');
  await db.ref(`users/${x.uid}/wallet/balance`).set(Number(r.val() || 0) + Number(x.amount || 0));
  await db.ref(`withdrawals/${id}`).update({ status: 'Rejected', rejectedAt: Date.now() });
  await db.ref(`users/${x.uid}/wallet/history`).push({ type: 'Withdraw', amount: Number(x.amount || 0), time: Date.now(), status: 'Rejected' });
  await window.loadAll();
  toast('Rejected and refunded');
};

window.toggleBan = async (uid: string, banned: boolean) => {
  let reason = '';
  if (!banned) {
    const r = await window.Swal.fire({ title: 'Ban reason', input: 'text', inputPlaceholder: 'Reason...', background: '#fff', color: '#102a56', showCancelButton: true, confirmButtonColor: '#ef4444' });
    if (!r.isConfirmed) return;
    reason = r.value || 'Violation of rules';
  } else if (!(await confirmBox('Unban this user?'))) return;
  await db.ref(`users/${uid}`).update({ isBanned: !banned, banReason: reason });
  await window.loadAll();
  toast(banned ? 'User unbanned' : 'User banned');
};

window.editUser = async (uid: string) => {
  const u = window.DATA.users[uid] || {};
  const r = await window.Swal.fire({
    title: 'Edit Wallet',
    background: '#fff',
    color: '#102a56',
    html: `<input id="sw-w" class="swal2-input" type="number" placeholder="Withdrawable" value="${Number(u.wallet?.balance || 0)}">
           <input id="sw-nw" class="swal2-input" type="number" placeholder="Non-withdrawable" value="${Number(u.wallet?.nonWithdrawableBalance || 0)}">`,
    showCancelButton: true,
    confirmButtonColor: '#1769e0',
    preConfirm: () => ({ w: Number((document.getElementById('sw-w') as HTMLInputElement).value || 0), nw: Number((document.getElementById('sw-nw') as HTMLInputElement).value || 0) })
  });
  if (!r.isConfirmed) return;
  await db.ref(`users/${uid}/wallet`).update({ balance: r.value.w, nonWithdrawableBalance: r.value.nw });
  await window.loadAll();
  toast('Wallet updated');
};

function flattenRegs() {
  let out: any[] = [];
  Object.entries(window.DATA.registrations || {}).forEach(([mid, regs]: any) => Object.entries(regs || {}).forEach(([rid, r]: any) => out.push({ mid, rid, ...r })));
  return out;
}

window.renderRegistrations = () => {
  const q = (($('regSearch') as HTMLInputElement)?.value || '').toLowerCase();
  const arr = flattenRegs().filter(r => `${r.mid} ${r.team || ''} ${r.playerLength || ''} ${r.playerName || ''} ${r.gameUid || ''} ${r.uid || ''}`.toLowerCase().includes(q));
  const list = $('regsList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(r => {
      const st = String(r.status || '').toLowerCase();
      const approved = st === 'approved';
      const rejected = st.includes('reject');
      return `
        <tr>
          <td><strong>${esc(window.DATA.matches[r.mid]?.title || window.DATA.matches[r.mid]?.name || 'Match')}</strong><br><small>${esc(r.mid)}</small></td>
          <td>${esc(r.team || r.squadName || '')}</td>
          <td>${esc(r.playerName || r.playerLength || '')}</td>
          <td>${esc(r.gameUid || r.gameUID || r.game_uid || r.uid || r.userId || '')}</td>
          <td><span class="badge ${approved ? 'approved' : rejected ? 'rejected' : 'pending'}">${esc(r.status || 'Pending')}</span></td>
          <td>${time(r.time)}</td>
          <td><div class="actions">
            ${!approved && !rejected ? `<button class="btn sm green" onclick="window.approveRegistration('${esc(r.mid)}','${esc(r.rid)}')">Approve</button><button class="btn sm red" onclick="window.rejectRegistration('${esc(r.mid)}','${esc(r.rid)}')">Reject</button>` : ''}
            <button class="btn sm red" onclick="window.removePath('registrations/${esc(r.mid)}/${esc(r.rid)}','Registration')">Delete</button>
          </div></td>
        </tr>`;
    }).join('') : `<tr><td colspan="7" class="empty">No registrations.</td></tr>`;
  }
};

window.approveRegistration = async (mid: string, rid: string) => {
  const ref = db.ref(`registrations/${mid}/${rid}`);
  const snap = await ref.once('value');
  if (!snap.exists()) return toast('Registration not found');
  const r = snap.val() || {};
  if (String(r.status || '').toLowerCase() === 'approved') return toast('Already approved');
  await ref.update({ status: 'Approved', approvedAt: Date.now(), approvedBy: 'Admin' });
  await db.ref(`users/${r.uid || r.userId}/purchasedSlots/${mid}`).update({ joinStatus: 'Approved', approvedAt: Date.now() });
  await window.logModeratorAction('Registration Approved', `Match: ${mid} • Registration: ${rid}`);
  await window.loadAll();
  toast('Registration approved');
};

window.rejectRegistration = async (mid: string, rid: string) => {
  const ref = db.ref(`registrations/${mid}/${rid}`);
  const snap = await ref.once('value');
  if (!snap.exists()) return toast('Registration not found');
  const r = snap.val() || {};
  if (String(r.status || '').toLowerCase().includes('reject')) return toast('Already rejected');
  const ok = await confirmBox('Reject registration?', 'Entry registration will be rejected.');
  if (!ok) return;
  await ref.update({ status: 'Rejected', rejectedAt: Date.now(), rejectedBy: 'Admin' });
  const uid = r.uid || r.userId;
  if (uid) {
    const refund = Number(r.entryFee || 0);
    if (refund > 0) {
      await db.ref(`users/${uid}/wallet/balance`).transaction((v: any) => Number(v || 0) + refund);
      await db.ref(`users/${uid}/wallet/history`).push({ type: 'Match Entry Refund', amount: refund, time: Date.now(), status: 'Refunded', matchId: mid, registrationId: rid });
    }
    await db.ref(`users/${uid}/purchasedSlots/${mid}`).update({ joinStatus: 'Rejected', rejectedAt: Date.now() });
  }
  await db.ref(`matches/${mid}/slots`).transaction((v: any) => Math.max(0, Number(v || 0) - 1));
  await window.logModeratorAction('Registration Rejected', `Match: ${mid} • Registration: ${rid}`);
  await window.loadAll();
  toast('Registration rejected and fee refunded');
};

window.renderSlotRequests = () => {
  const arr = Object.entries(window.DATA.slotRequests).sort((a: any, b: any) => (b[1]?.time || 0) - (a[1]?.time || 0));
  const list = $('slotList');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, x]: any) => `
      <tr>
        <td>${esc(x.name || x.uid || '')}</td>
        <td>${esc(x.team || x.squadName || '')}</td>
        <td>${esc(x.playerName || '')}</td>
        <td>${money(x.amount)}</td>
        <td>${esc(x.trxId || '')}</td>
        <td>${esc((x.matchIds || []).join(', '))}</td>
        <td><span class="badge ${x.status === 'Pending' ? 'pending' : x.status === 'Rejected' ? 'rejected' : 'approved'}">${esc(x.status)}</span></td>
        <td><div class="actions">
          ${x.status === 'Pending' ? `<button class="btn sm green" onclick="window.approveSlotRequest('${esc(id)}')">Approve</button><button class="btn sm red" onclick="window.rejectSlotRequest('${esc(id)}')">Reject</button>` : ''}
          <button class="btn sm blue" onclick="window.openJson('slot_requests/${esc(id)}')">View</button>
        </div></td>
      </tr>`).join('') : `<tr><td colspan="8" class="empty">No slot requests.</td></tr>`;
  }
};

window.approveSlotRequest = async (id: string) => {
  const snap = await db.ref(`slot_requests/${id}`).once('value');
  if (!snap.exists()) return window.Swal.fire({ icon: 'error', title: 'Request not found', background: '#fff', color: '#102a56' });
  const req = snap.val() || {};
  if (String(req.status || '').toLowerCase() !== 'pending') return toast('This request is already resolved.');
  if (!(await confirmBox('Approve slot booking?', `${money(req.amount)} • ${req.method || 'Nagad'} • ${req.trxId || ''}`))) return;
  try {
    const live = (await db.ref(`slot_requests/${id}`).once('value')).val() || {};
    if (String(live.status || '').toLowerCase() !== 'pending') return toast('This request is already resolved.');
    const uid = live.uid;
    const matchIds = Array.isArray(live.matchIds) ? live.matchIds : Object.values(live.matchIds || {});
    const teams = Array.isArray(live.teamsData) ? live.teamsData : Object.values(live.teamsData || {});
    if (!uid || uid === 'Guest' || !matchIds.length || !teams.length) throw new Error('Slot request data is incomplete.');
    const updates: any = {};
    const joinedAt = Date.now();
    const d = new Date();
    const dateStr = d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' }).toUpperCase() + ' ' + d.getFullYear();

    for (const rawId of matchIds) {
      const mId = String(rawId);
      const ms = await db.ref(`matches/${mId}`).once('value');
      if (!ms.exists()) throw new Error('Match not found: ' + mId);
      const m = ms.val() || {};
      const rs = await db.ref(`registrations/${mId}`).once('value');
      let count = 0, fakeKey: any = null;
      rs.forEach((r: any) => { count++; if (r.val()?.isFake && !fakeKey) fakeKey = r.key; });
      for (const t of teams) {
        const reg = { team: t.squadName || t.team || '', playerLength: t.playerName || t.player || '', status: 'Paid(Nagad)', time: joinedAt, isFake: false, uid };
        if (count >= Number(m.totalSlots || 10) && fakeKey) {
          updates[`registrations/${mId}/${fakeKey}`] = reg;
          fakeKey = null;
        } else {
          const k = db.ref(`registrations/${mId}`).push().key;
          updates[`registrations/${mId}/${k}`] = reg;
          count++;
        }
      }
      updates[`matches/${mId}/slots`] = Number(m.slots || 0) + teams.length;
      updates[`users/${uid}/purchasedSlots/${mId}`] = {
        matchId: mId, time: m.time || '', date: dateStr,
        whatsappGroupLink: m.whatsappLink || '#',
        joinMessage: m.joinMessage || 'WhatsApp Group Link',
        joinStatus: 'Joined', joinedAt,
        teamName: teams[0]?.squadName || teams[0]?.team || live.team || ''
      };
    }
    updates[`slot_requests/${id}/status`] = 'Approved';
    updates[`slot_requests/${id}/approvedAt`] = joinedAt;
    updates[`slot_requests/${id}/approvedBy`] = 'Admin';
    await db.ref().update(updates);
    await db.ref(`users/${uid}/wallet/history`).push({
      type: 'Slot Booking', amount: Number(live.amount || 0), time: joinedAt,
      status: 'Approved', method: live.method || 'Nagad', trxId: live.trxId || '',
      requestId: id, slotsCount: teams.length * matchIds.length
    });
    await window.logModeratorAction('Slot Request Approved', `Request: ${id}`); await window.loadAll(); toast('Slot booking approved');
  } catch (e: any) {
    window.Swal.fire({ icon: 'error', title: 'Approval failed', text: e.message || String(e), background: '#fff', color: '#102a56' });
  }
};

window.rejectSlotRequest = async (id: string) => {
  const snap = await db.ref(`slot_requests/${id}`).once('value');
  if (!snap.exists()) return toast('Request not found');
  const x = snap.val() || {};
  if (String(x.status || '').toLowerCase() !== 'pending') return toast('This request is already resolved.');
  const r = await window.Swal.fire({ title: 'Reject slot booking?', input: 'text', inputLabel: 'Reason (optional)', background: '#fff', color: '#102a56', showCancelButton: true, confirmButtonColor: '#ef4444' });
  if (!r.isConfirmed) return;
  try {
    await db.ref(`slot_requests/${id}`).update({ status: 'Rejected', rejectedAt: Date.now(), rejectedBy: 'Admin', rejectReason: (r.value || '').trim() });
    await window.logModeratorAction('Slot Request Rejected', `Request: ${id}`); await window.loadAll(); toast('Slot booking rejected');
  } catch (e: any) { window.Swal.fire({ icon: 'error', title: 'Reject failed', text: e.message || String(e), background: '#fff', color: '#102a56' }) }
};

window.renderModeratorNotices = () => {
  const arr = Object.entries(window.DATA.notices || {});
  const list = $('moderatorNotices');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, n]: any) => `
      <div class="item">
        <div class="item-main"><b>${esc(n.title || 'Notice')}</b><small>${esc(n.message || n.description || '')} • ${time(n.time || n.updatedAt || n.createdAt)}</small></div>
        <div class="actions"><button class="btn sm blue" onclick="window.openNoticeEditor('${esc(id)}')">Edit</button><button class="btn sm red" onclick="window.removePath('notices/${esc(id)}','Notice')">Delete</button></div>
      </div>`).join('') : `<div class="empty">No notices found.</div>`;
  }
};

window.renderModeratorResults = () => {
  const arr = Object.entries(window.DATA.matches).filter(([id, m]: any) => m.result || m.results || String(m.status || '').toLowerCase() === 'completed');
  const list = $('moderatorResults');
  if (list) {
    list.innerHTML = arr.length ? arr.map(([id, m]: any) => `
      <div class="item">
        <div class="item-main"><b>${esc(m.title || m.name || 'Match')}</b><small>Match ID: ${esc(id)} • Result: ${esc(m.result || m.results || 'Not set')} • Status: ${esc(m.status || '')}</small></div>
        <div class="actions"><button class="btn sm blue" onclick="window.openResultEditor('${esc(id)}')">Edit Result</button></div>
      </div>`).join('') : `<div class="empty">No match results found.</div>`;
  }
};

function findUserByKey(key: string) {
  key = String(key || '').trim().toLowerCase();
  if (!key) return null;
  const entries = Object.entries(window.DATA.users || {});
  for (const [uid, uVal] of entries) {
    const u: any = uVal;
    if (uid.toLowerCase() === key) return { uid, u };
    if (String(u.email || '').trim().toLowerCase() === key) return { uid, u };
  }
  return null;
}

window.previewBalanceUser = () => {
  const key = ($('balanceUserKey') as HTMLInputElement).value.trim();
  const found = findUserByKey(key);
  const box = $('balanceUserPreview');
  if (!box) return null;
  if (!found) {
    box.innerHTML = '<div class="danger-note">User পাওয়া যায়নি। UID অথবা Firebase users-এর exact Gmail দিন।</div>';
    return null;
  }
  const u: any = found.u || {};
  box.innerHTML = `
    <div class="item">
      <div class="item-left">
        <div class="hero-logo" style="width:42px;height:42px;font-size:14px">${esc(String(u.name || 'U').slice(0, 1).toUpperCase())}</div>
        <div class="item-main"><b>${esc(u.name || 'User')}</b><small>UID: ${esc(found.uid)}<br>Email: ${esc(u.email || '—')} • Current Balance: ${money(u.wallet?.balance)}</small></div>
      </div>
      <span class="badge approved">USER FOUND</span>
    </div>`;
  return found;
};

window.clearBalanceForm = () => {
  ($('balanceUserKey') as HTMLInputElement).value = '';
  ($('balanceAmount') as HTMLInputElement).value = '';
  ($('balanceNote') as HTMLInputElement).value = '';
  const preview = $('balanceUserPreview');
  if (preview) preview.innerHTML = '';
};

window.addUserBalance = async () => {
  const found = findUserByKey(($('balanceUserKey') as HTMLInputElement).value);
  const amount = Number(($('balanceAmount') as HTMLInputElement).value || 0);
  const note = ($('balanceNote') as HTMLInputElement).value.trim() || 'Moderator added balance';
  if (!found) return window.previewBalanceUser();
  const u: any = found.u;
  if (!Number.isFinite(amount) || amount <= 0) return window.Swal.fire({ icon: 'warning', title: 'Valid amount required', text: 'Amount must be greater than 0.', background: '#fff', color: '#102a56' });
  const ok = await confirmBox('Add balance?', `${money(amount)} will be added to ${u.name || 'this user'} wallet.`);
  if (!ok) return;
  const uid = found.uid;
  const ref = db.ref(`users/${uid}/wallet/balance`);
  const tx = await ref.transaction((v: any) => Number(v || 0) + amount);
  if (!tx.committed) return toast('Balance update failed');
  await db.ref(`users/${uid}/wallet/history`).push({ type: 'Moderator Added Balance', amount, time: Date.now(), status: 'Approved', note, addedBy: 'Moderator', uid });
  await window.logModeratorAction('Balance Added', `${money(amount)} added to ${u.email || u.name || uid} (${uid})${note ? ' • ' + note : ''}`);
  await window.loadAll();
  ($('balanceUserKey') as HTMLInputElement).value = uid;
  window.previewBalanceUser();
  ($('balanceAmount') as HTMLInputElement).value = '';
  ($('balanceNote') as HTMLInputElement).value = '';
  toast(`${money(amount)} added successfully`);
};

window.saveSocialMedia = async () => {
  const socialLinks = {
    whatsapp: ($('modWhatsapp') as HTMLInputElement).value.trim(),
    tiktok: ($('modTiktok') as HTMLInputElement).value.trim(),
    facebook: ($('modFacebook') as HTMLInputElement).value.trim(),
    youtube: ($('modYoutube') as HTMLInputElement).value.trim(),
    telegram: ($('modTelegram') as HTMLInputElement).value.trim(),
    messenger: ($('modMessenger') as HTMLInputElement).value.trim()
  };
  await db.ref('appSettings/socialLinks').set(socialLinks);
  if (!window.DATA.settings) window.DATA.settings = {};
  window.DATA.settings.socialLinks = socialLinks;
  fillModeratorSocial();
  await window.logModeratorAction('Social Media Updated', 'WhatsApp, TikTok, Facebook, YouTube, Telegram and Messenger links updated');
  toast('Social media links saved');
};

window.saveSettings = async () => {
  const old = window.DATA.settings || {};
  const val = {
    ...old,
    dailyLogo: ($('stDailyLogo') as HTMLInputElement).value.trim(),
    champLogo: ($('stChampLogo') as HTMLInputElement).value.trim(),
    supportNumber: ($('stSupport') as HTMLInputElement).value.trim(),
    maintenanceMode: ($('stMaintenance') as HTMLInputElement).value === 'true',
    bkashNumber: ($('stBkash') as HTMLInputElement).value.trim(),
    nagadNumber: ($('stNagad') as HTMLInputElement).value.trim(),
    rocketNumber: ($('stRocket') as HTMLInputElement).value.trim(),
    paymentInstructions: ($('stPayNote') as HTMLInputElement).value.trim(),
    welcomePopup: { ...(old.welcomePopup || {}), enabled: ($('stWelcomeEnabled') as HTMLInputElement).value === 'true', title: ($('stWelcomeTitle') as HTMLInputElement).value, message: ($('stWelcomeMessage') as HTMLTextAreaElement).value, image: ($('stWelcomeImage') as HTMLInputElement).value },
    socialLinks: {
      ...(old.socialLinks || {}),
      whatsapp: ($('stWhatsapp') as HTMLInputElement).value.trim(),
      tiktok: ($('stTiktok') as HTMLInputElement).value.trim(),
      facebook: ($('stFacebook') as HTMLInputElement).value.trim(),
      youtube: ($('stYoutube') as HTMLInputElement).value.trim(),
      telegram: ($('stTelegram') as HTMLInputElement).value.trim(),
      messenger: ($('stMessenger') as HTMLInputElement).value.trim()
    }
  };
  await db.ref('appSettings').set(val);
  await window.loadAll();
  toast('Settings saved');
};

window.openEditor = (type, id) => {
  window.editing = { type, id: id || null };
  let data = id ? (type === 'category' ? window.DATA.categories[id] : type === 'match' ? window.DATA.matches[id] : window.DATA.banners[id]) : {};
  let title = id ? 'Edit ' : 'Add ';
  const root = $('modalRoot');
  if (!root) return;
  if (type === 'category') {
    root.innerHTML = `<div class="panel" style="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:50;display:flex;align-items:center;justify-content:center"><div class="panel" style="width:min(560px,94vw);margin:0"><div class="panel-head"><h2>${title}Category</h2><button class="btn" onclick="window.closeModal()">×</button></div><div class="formgrid"><div class="field"><label>Name</label><input id="fName" value="${esc(data.name || '')}"></div><div class="field"><label>Logo URL</label><input id="fLogo" value="${esc(data.logo || '')}"></div><div class="field full"><label>Notice</label><textarea id="fNotice">${esc(data.notice || '')}</textarea></div></div><div class="actions" style="margin-top:12px"><button class="btn primary" onclick="window.saveEditor()">Save Category</button></div></div></div>`;
  } else if (type === 'banner') {
    root.innerHTML = `<div class="panel" style="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:50;display:flex;align-items:center;justify-content:center"><div class="panel" style="width:min(560px,94vw);margin:0"><div class="panel-head"><h2>${title}Banner</h2><button class="btn" onclick="window.closeModal()">×</button></div><div class="formgrid"><div class="field full"><label>Image URL</label><input id="fImage" value="${esc(data.image || '')}"></div><div class="field full"><label>Match ID (optional)</label><input id="fMatchId" value="${esc(data.matchId || data.match_id || '')}" placeholder="Banner চাপলে কোন Match দেখাবে"></div><div class="field full"><label>Click Link (optional)</label><input id="fLink" value="${esc(data.link || '')}"></div></div><div class="actions" style="margin-top:12px"><button class="btn primary" onclick="window.saveEditor()">Save Banner</button></div></div></div>`;
  } else {
    root.innerHTML = `<div class="panel" style="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:50;display:flex;align-items:center;justify-content:center"><div class="panel" style="width:min(760px,95vw);margin:0;max-height:92vh;overflow:auto"><div class="panel-head"><h2>${title}Match</h2><button class="btn" onclick="window.closeModal()">×</button></div><div class="formgrid three"><div class="field"><label>Category</label><input id="fCategory" value="${esc(data.category || '')}"></div><div class="field"><label>Title / Name</label><input id="fTitle" value="${esc(data.title || data.name || '')}"></div><div class="field"><label>Map</label><input id="fMap" value="${esc(data.map || 'Erangel')}"></div><div class="field"><label>Date</label><input id="fDate" value="${esc(data.date || '')}"></div><div class="field"><label>Time</label><input id="fTime" value="${esc(data.time || '')}"></div><div class="field"><label>Mode</label><input id="fMode" value="${esc(data.mode || 'SQUAD')}"></div><div class="field"><label>Status</label><select id="fStatus"><option value="Upcoming" ${(!data.status || data.status === 'Upcoming') ? 'selected' : ''}>UPCOMING</option><option value="Live" ${data.status === 'Live' ? 'selected' : ''}>LIVE</option><option value="Completed" ${data.status === 'Completed' ? 'selected' : ''}>COMPLETED</option></select></div><div class="field"><label>Room ID</label><input id="fRoomId" value="${esc(data.roomId || data.roomID || '')}"></div><div class="field"><label>Room Password</label><input id="fRoomPassword" value="${esc(data.roomPassword || data.roomPass || '')}"></div><div class="field"><label>Prize</label><input id="fPrize" type="number" value="${Number(data.prize || 0)}"></div><div class="field"><label>Entry Fee</label><input id="fFee" type="number" value="${Number(data.fee || 0)}"></div><div class="field"><label>Total Slots</label><input id="fTotal" type="number" value="${Number(data.totalSlots || 10)}"></div><div class="field"><label>Joined Slots</label><input id="fSlots" type="number" value="${Number(data.slots || 0)}"></div><div class="field"><label>Sort Order</label><input id="fSort" type="number" value="${Number(data.sortOrder || 0)}"></div><div class="field"><label>Closed</label><select id="fClosed"><option value="false">NO</option><option value="true" ${data.isClosed ? 'selected' : ''}>YES</option></select></div><div class="field"><label>Hidden</label><select id="fHidden"><option value="false">NO</option><option value="true" ${data.isHidden ? 'selected' : ''}>YES</option></select></div><div class="field"><label>WhatsApp Group Link</label><input id="fWa" value="${esc(data.whatsappLink || '')}"></div><div class="field full"><label>Join Message</label><textarea id="fJoin">${esc(data.joinMessage || '')}</textarea></div><div class="field full"><label>Rules</label><textarea id="fRules">${esc(data.rules || '')}</textarea></div><div class="field full"><label>Prize Details</label><textarea id="fPrizeDetails">${esc(data.prizeDetails || data.prizeInfo || '')}</textarea></div><div class="field full"><label>Slots Details</label><textarea id="fSlotDetails">${esc(data.slotDetails || data.slotsInfo || '')}</textarea></div></div><div class="actions" style="margin-top:12px"><button class="btn primary" onclick="window.saveEditor()">Save Match</button></div></div></div>`;
  }
};

window.openUpcomingBannerEditor = (id) => {
  const data = id ? (window.DATA.banners[id] || {}) : {};
  const title = id ? 'Edit Upcoming Banner' : 'Add Upcoming Banner';
  window.editing = { type: 'upcomingBanner', id: id || null };
  const root = $('modalRoot');
  if (!root) return;
  root.innerHTML = `<div class="panel" style="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:50;display:flex;align-items:center;justify-content:center"><div class="panel" style="width:min(560px,94vw);margin:0"><div class="panel-head"><h2>${title}</h2><button class="btn" onclick="window.closeModal()">×</button></div><div class="formgrid"><div class="field full"><label>Image URL</label><input id="ufImage" value="${esc(data.image || '')}"></div><div class="field full"><label>Match ID (optional)</label><input id="ufMatchId" value="${esc(data.matchId || data.match_id || data.matchKey || '')}" placeholder="Banner চাপলে কোন Match দেখাবে"></div><div class="field full"><label>Click Link (optional)</label><input id="ufLink" value="${esc(data.link || '')}"></div></div><div class="actions" style="margin-top:12px"><button class="btn primary" onclick="window.saveUpcomingBanner()">Save Upcoming Banner</button></div></div></div>`;
};

window.saveUpcomingBanner = async () => {
  const id = window.editing?.id;
  const image = ($('ufImage') as HTMLInputElement).value.trim();
  if (!image) return window.Swal.fire({ icon: 'warning', title: 'Image URL required', background: '#fff', color: '#102a56' });
  const val = { image, matchId: ($('ufMatchId') as HTMLInputElement).value.trim(), link: ($('ufLink') as HTMLInputElement).value.trim() };
  const path = id ? `appSettings/upcomingBanners/${id}` : 'appSettings/upcomingBanners/' + db.ref('appSettings/upcomingBanners').push().key;
  await db.ref(path).set(val);
  await window.logModeratorAction(id ? 'Upcoming Banner Edited' : 'Upcoming Banner Added', `Match ID: ${val.matchId || '—'}`);
  window.closeModal();
  await window.loadAll();
  toast('Upcoming banner saved');
};

window.closeModal = () => {
  const root = $('modalRoot');
  if (root) root.innerHTML = '';
};

window.saveEditor = async () => {
  const { type, id } = window.editing;
  let path, val;
  if (type === 'category') {
    val = { name: ($('fName') as HTMLInputElement).value.trim(), logo: ($('fLogo') as HTMLInputElement).value.trim(), notice: ($('fNotice') as HTMLTextAreaElement).value.trim() };
    if (!val.name) return window.Swal.fire({ icon: 'warning', title: 'Name required', background: '#fff', color: '#102a56' });
    path = id ? `categories/${id}` : 'categories/' + db.ref('categories').push().key;
  } else if (type === 'banner') {
    val = { image: ($('fImage') as HTMLInputElement).value.trim(), matchId: ($('fMatchId') as HTMLInputElement).value.trim(), link: ($('fLink') as HTMLInputElement).value.trim() };
    if (!val.image) return window.Swal.fire({ icon: 'warning', title: 'Image URL required', background: '#fff', color: '#102a56' });
    path = id ? `appSettings/banners/${id}` : 'appSettings/banners/' + db.ref('appSettings/banners').push().key;
  } else {
    val = {
      category: ($('fCategory') as HTMLInputElement).value.trim(),
      title: ($('fTitle') as HTMLInputElement).value.trim(),
      name: ($('fTitle') as HTMLInputElement).value.trim(),
      map: ($('fMap') as HTMLInputElement).value.trim(),
      date: ($('fDate') as HTMLInputElement).value.trim(),
      time: ($('fTime') as HTMLInputElement).value.trim(),
      mode: ($('fMode') as HTMLInputElement).value.trim() || 'SQUAD',
      status: ($('fStatus') as HTMLSelectElement).value,
      roomId: ($('fRoomId') as HTMLInputElement).value.trim(),
      roomPassword: ($('fRoomPassword') as HTMLInputElement).value.trim(),
      prize: Number(($('fPrize') as HTMLInputElement).value || 0),
      fee: Number(($('fFee') as HTMLInputElement).value || 0),
      totalSlots: Number(($('fTotal') as HTMLInputElement).value || 0),
      slots: Number(($('fSlots') as HTMLInputElement).value || 0),
      sortOrder: Number(($('fSort') as HTMLInputElement).value || 0),
      isClosed: ($('fClosed') as HTMLSelectElement).value === 'true',
      isHidden: ($('fHidden') as HTMLSelectElement).value === 'true',
      whatsappLink: ($('fWa') as HTMLInputElement).value.trim(),
      joinMessage: ($('fJoin') as HTMLTextAreaElement).value.trim(),
      rules: ($('fRules') as HTMLTextAreaElement).value.trim(),
      prizeDetails: ($('fPrizeDetails') as HTMLTextAreaElement).value.trim(),
      slotDetails: ($('fSlotDetails') as HTMLTextAreaElement).value.trim()
    };
    path = id ? `matches/${id}` : 'matches/' + db.ref('matches').push().key;
  }
  await db.ref(path).set(val);
  await window.logModeratorAction(type === 'category' ? (id ? 'Category Edited' : 'Category Added') : type === 'banner' ? (id ? 'Banner Edited' : 'Banner Added') : (id ? 'Match Edited' : 'Match Added'), type === 'category' ? `Category: ${val.name || ''}` : type === 'banner' ? `Match ID: ${val.matchId || '—'}` : `Match: ${val.title || ''}`);
  window.closeModal();
  await window.loadAll();
  toast('Saved successfully');
};

window.removePath = async (path, label) => {
  if (!(await confirmBox(`Delete ${label}?`))) return;
  await db.ref(path).remove();
  await window.logModeratorAction(label + ' Deleted', path);
  await window.loadAll();
  toast(label + ' deleted');
};

window.openJson = async (path) => {
  const s = await db.ref(path).once('value');
  await window.Swal.fire({ title: path, html: `<pre style="text-align:left;max-height:60vh;overflow:auto;white-space:pre-wrap;color:#475569">${esc(JSON.stringify(s.val(), null, 2))}</pre>`, background: '#fff', color: '#102a56', width: 700 });
};

window.readRaw = async () => {
  const p = ($('rawPath') as HTMLInputElement).value.trim();
  if (!p) return;
  const s = await db.ref(p).once('value');
  const out = $('rawOutput');
  if (out) out.textContent = JSON.stringify(s.val(), null, 2);
};

window.writeRaw = async () => {
  const p = ($('rawPath') as HTMLInputElement).value.trim();
  if (!p) return;
  let v;
  try {
    v = JSON.parse(($('rawJson') as HTMLTextAreaElement).value);
  } catch (e: any) {
    return window.Swal.fire({ icon: 'error', title: 'Invalid JSON', text: e.message, background: '#fff', color: '#102a56' });
  }
  if (!(await confirmBox('Write database path?', p))) return;
  await db.ref(p).set(v);
  await window.loadAll();
  await window.readRaw();
  toast('Database updated');
};

window.deleteRaw = async () => {
  const p = ($('rawPath') as HTMLInputElement).value.trim();
  if (!p) return;
  if (!(await confirmBox('Delete database path?', p))) return;
  await db.ref(p).remove();
  await window.loadAll();
  await window.readRaw();
  toast('Database path deleted');
};

window.logModeratorAction = async (action, details) => {
  try {
    await db.ref('moderatorHistory').push({ action: String(action || ''), details: String(details || ''), time: Date.now(), by: 'Moderator' });
  } catch (e) {
    console.warn('History log failed', e);
  }
};

window.openNoticeEditor = (id) => {
  const n = id ? (window.DATA.notices[id] || {}) : {};
  const root = $('modalRoot');
  if (!root) return;
  root.innerHTML = `<div class="panel" style="position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:50;display:flex;align-items:center;justify-content:center"><div class="panel" style="width:min(560px,94vw);margin:0"><div class="panel-head"><h2>${id ? 'Edit' : 'Add'} Notice</h2><button class="btn" onclick="window.closeModal()">×</button></div><div class="formgrid"><div class="field full"><label>Title</label><input id="noticeTitle" value="${esc(n.title || '')}"></div><div class="field full"><label>Message</label><textarea id="noticeMessage">${esc(n.message || n.description || '')}</textarea></div></div><div class="actions" style="margin-top:12px"><button class="btn primary" onclick="window.saveNotice('${esc(id || '')}')">Save Notice</button></div></div></div>`;
};

window.saveNotice = async (id) => {
  const title = ($('noticeTitle') as HTMLInputElement).value.trim();
  const message = ($('noticeMessage') as HTMLTextAreaElement).value.trim();
  if (!title || !message) return window.Swal.fire({ icon: 'warning', title: 'Title and message required', background: '#fff', color: '#102a56' });
  const key = id || db.ref('notices').push().key;
  await db.ref('notices/' + key).set({ title, message, time: Date.now(), updatedAt: Date.now() });
  await window.logModeratorAction(id ? 'Notice Edited' : 'Notice Added', title);
  window.closeModal();
  await window.loadAll();
  toast('Notice saved');
};

window.openResultEditor = (id) => {
  let m = id ? (window.DATA.matches[id] || {}) : {};
  const matches = Object.entries(window.DATA.matches);
  const root = $('modalRoot');
  if (!root) return;
  root.innerHTML = `<div class="panel" style="position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:50;display:flex;align-items:center;justify-content:center"><div class="panel" style="width:min(600px,94vw);margin:0"><div class="panel-head"><h2>${id ? 'Edit' : 'Add / Update'} Match Result</h2><button class="btn" onclick="window.closeModal()">×</button></div><div class="field"><label>Match</label><select id="resultMatch">${matches.map(([mid, x]: any) => `<option value="${esc(mid)}" ${mid === id ? 'selected' : ''}>${esc(x.title || x.name || mid)}</option>`).join('')}</select></div><div class="field" style="margin-top:10px"><label>Result / Winner Information</label><textarea id="resultText">${esc(m.result || m.results || '')}</textarea></div><div class="actions" style="margin-top:12px"><button class="btn primary" onclick="window.saveResult()">Save Result</button></div></div></div>`;
};

window.saveResult = async () => {
  const id = ($('resultMatch') as HTMLSelectElement).value;
  const text = ($('resultText') as HTMLTextAreaElement).value.trim();
  if (!id) return;
  if (!text) return window.Swal.fire({ icon: 'warning', title: 'Result required', background: '#fff', color: '#102a56' });
  await db.ref('matches/' + id).update({ result: text, status: 'Completed', resultUpdatedAt: Date.now() });
  await window.logModeratorAction('Match Result Updated', `Match: ${window.DATA.matches[id]?.title || id}`);
  window.closeModal();
  await window.loadAll();
  toast('Match result updated');
};

// Initial setup after root renders
setTimeout(() => {
  document.querySelectorAll('.nav button').forEach(b => b.addEventListener('click', () => window.showPage((b as HTMLElement).dataset.page || 'dashboard')));
  document.querySelectorAll('.mobile-bottom button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.mobile-bottom button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    window.showPage((b as HTMLElement).dataset.mob || 'dashboard');
  }));
  const menuBtn = $('menuBtn');
  if (menuBtn) menuBtn.onclick = () => $('sidebar')?.classList.toggle('open');

  window.loadAll().catch(e => window.Swal.fire({ icon: 'error', title: 'Firebase Error', text: e.message, background: '#fff', color: '#102a56' }));
}, 100);
