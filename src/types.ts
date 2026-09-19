export {};

declare global {
  interface Window {
    firebase: any;
    db: any;
    DATA: any;
    editing: any;
    Swal: any;
    refreshAll: () => void;
    showPage: (p: string) => void;
    openEditor: (type: string, id?: string | null) => void;
    openUpcomingBannerEditor: (id?: string | null) => void;
    closeModal: () => void;
    saveEditor: () => Promise<void>;
    saveUpcomingBanner: () => Promise<void>;
    removePath: (path: string, label: string) => Promise<void>;
    openJson: (path: string) => Promise<void>;
    readRaw: () => Promise<void>;
    writeRaw: () => Promise<void>;
    deleteRaw: () => Promise<void>;
    logModeratorAction: (action: string, details: string) => Promise<void>;
    approveDeposit: (id: string) => Promise<void>;
    rejectDepositRequest: (id: string) => Promise<void>;
    approveWithdrawal: (id: string) => Promise<void>;
    rejectWithdrawal: (id: string) => Promise<void>;
    toggleBan: (uid: string, banned: boolean) => Promise<void>;
    editUser: (uid: string) => Promise<void>;
    approveRegistration: (mid: string, rid: string) => Promise<void>;
    rejectRegistration: (mid: string, rid: string) => Promise<void>;
    approveSlotRequest: (id: string) => Promise<void>;
    rejectSlotRequest: (id: string) => Promise<void>;
    previewBalanceUser: () => any;
    clearBalanceForm: () => void;
    addUserBalance: () => Promise<void>;
    saveSocialMedia: () => Promise<void>;
    saveSettings: () => Promise<void>;
    openNoticeEditor: (id?: string | null) => void;
    saveNotice: (id: string) => Promise<void>;
    openResultEditor: (id?: string | null) => void;
    saveResult: () => Promise<void>;
    renderDashboard: () => void;
    renderCategories: () => void;
    renderMatches: () => void;
    renderUpcoming: () => void;
    renderBanners: () => void;
    renderUpcomingBanners: () => void;
    renderUsers: () => void;
    renderDeposits: () => void;
    renderWithdrawals: () => void;
    renderRegistrations: () => void;
    renderSlotRequests: () => void;
    renderModeratorNotices: () => void;
    renderModeratorResults: () => void;
    loadAll: () => Promise<void>;
  }
}
