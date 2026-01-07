import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'id';

const translations = {
  en: {
    // Nav
    kanban: 'Kanban',
    team: 'Team',
    tasks: 'Tasks',
    calendar: 'Calendar',
    events: 'Events',
    activity: 'Activity',
    
    // Common
    workspace: 'Workspace',
    mainWorkspace: 'Main Workspace',
    addTask: 'Add Task',
    addEvent: 'Add Event',
    addMember: 'Add Member',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    
    // Login
    welcomeBack: 'Welcome Back',
    enterCredentials: 'Enter your credentials to access your workspace.',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    defaultLogin: 'Default Login',
    invalidCredentials: 'Invalid username or password',
    
    // Task
    taskTitle: 'Task Title',
    description: 'Description',
    priority: 'Priority',
    status: 'Status',
    dueDate: 'Due Date',
    assignee: 'Assignee',
    selectEvent: 'Select Event',
    eventRequired: 'Event selection is required',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
    createTask: 'Create Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    
    // Event
    eventTitle: 'Event Title',
    eventType: 'Event Type',
    client: 'Client',
    date: 'Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    location: 'Location',
    attendees: 'Attendees',
    createEvent: 'Create Event',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    meeting: 'Meeting',
    workshop: 'Workshop',
    deadline: 'Deadline',
    presentation: 'Presentation',
    
    // Team
    role: 'Role',
    email: 'Email',
    name: 'Name',
    owner: 'Owner',
    member: 'Member',
    createMember: 'Create Member',
    editMember: 'Edit Member',
    
    // Banner
    createEventFirst: 'Create an Event First!',
    needEventFirst: 'You need to create at least one event before adding tasks. Tasks must be linked to an event.',
    createFirstEvent: 'Create First Event',
    
    // Calendar
    today: 'Today',
    
    // Activity
    loggedIn: 'logged in',
    createdTask: 'created task',
    updatedDetails: 'updated details',
    deletedTask: 'deleted task',
    scheduledEvent: 'scheduled event',
    cancelledEvent: 'cancelled event',
    addedNewMember: 'added new member',
    removedUser: 'removed user',
    
    // Theme & Language
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    english: 'English',
    indonesian: 'Indonesian',
  },
  id: {
    // Nav
    kanban: 'Kanban',
    team: 'Tim',
    tasks: 'Tugas',
    calendar: 'Kalender',
    events: 'Acara',
    activity: 'Aktivitas',
    
    // Common
    workspace: 'Ruang Kerja',
    mainWorkspace: 'Ruang Kerja Utama',
    addTask: 'Tambah Tugas',
    addEvent: 'Tambah Acara',
    addMember: 'Tambah Anggota',
    logout: 'Keluar',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Ubah',
    close: 'Tutup',
    search: 'Cari',
    filter: 'Filter',
    all: 'Semua',
    
    // Login
    welcomeBack: 'Selamat Datang',
    enterCredentials: 'Masukkan kredensial untuk mengakses ruang kerja.',
    username: 'Nama Pengguna',
    password: 'Kata Sandi',
    login: 'Masuk',
    defaultLogin: 'Login Default',
    invalidCredentials: 'Nama pengguna atau kata sandi salah',
    
    // Task
    taskTitle: 'Judul Tugas',
    description: 'Deskripsi',
    priority: 'Prioritas',
    status: 'Status',
    dueDate: 'Tenggat',
    assignee: 'Penanggung Jawab',
    selectEvent: 'Pilih Acara',
    eventRequired: 'Wajib pilih acara',
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
    todo: 'Belum Dikerjakan',
    inProgress: 'Sedang Dikerjakan',
    done: 'Selesai',
    createTask: 'Buat Tugas',
    editTask: 'Ubah Tugas',
    deleteTask: 'Hapus Tugas',
    
    // Event
    eventTitle: 'Judul Acara',
    eventType: 'Tipe Acara',
    client: 'Klien',
    date: 'Tanggal',
    startTime: 'Waktu Mulai',
    endTime: 'Waktu Selesai',
    location: 'Lokasi',
    attendees: 'Peserta',
    createEvent: 'Buat Acara',
    editEvent: 'Ubah Acara',
    deleteEvent: 'Hapus Acara',
    meeting: 'Rapat',
    workshop: 'Workshop',
    deadline: 'Tenggat',
    presentation: 'Presentasi',
    
    // Team
    role: 'Peran',
    email: 'Email',
    name: 'Nama',
    owner: 'Pemilik',
    member: 'Anggota',
    createMember: 'Buat Anggota',
    editMember: 'Ubah Anggota',
    
    // Banner
    createEventFirst: 'Buat Acara Dulu!',
    needEventFirst: 'Anda perlu membuat acara terlebih dahulu sebelum menambahkan tugas. Tugas harus terhubung ke acara.',
    createFirstEvent: 'Buat Acara Pertama',
    
    // Calendar
    today: 'Hari Ini',
    
    // Activity
    loggedIn: 'masuk',
    createdTask: 'membuat tugas',
    updatedDetails: 'memperbarui detail',
    deletedTask: 'menghapus tugas',
    scheduledEvent: 'menjadwalkan acara',
    cancelledEvent: 'membatalkan acara',
    addedNewMember: 'menambahkan anggota baru',
    removedUser: 'menghapus pengguna',
    
    // Theme & Language
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    language: 'Bahasa',
    english: 'Inggris',
    indonesian: 'Indonesia',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kerja_language');
    return saved === 'id' ? 'id' : 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('kerja_language', lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
