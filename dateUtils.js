import { useMemo, useState } from 'react';
import { STAGE_LABELS } from './data/constants.js';
import { useCandidates } from './hooks/useCandidates.js';
import { useOrders } from './hooks/useOrders.js';
import { getCurrentDateOnlyString } from './utils/dateUtils.js';
import { calculateOrderRealization, getCandidateAssessmentDate, getCandidateAssessmentTime, normalizeOrderGender, splitOrdersByActivity } from './utils/orderUtils.js';
import { assignBhpAfterMedical, assignBhpFromReserveWithDate, changeCandidateStatus, restoreCandidateFromRejections, returnToMedicalFromReserve as returnToMedicalFromReserveWorkflow, rollbackCandidateStage, sendPassedMedicalToReserve } from './utils/candidateWorkflow.js';
import { useAuth } from './hooks/useAuth.jsx';
import LoginScreen from './components/auth/LoginScreen.jsx';
import Toast from './components/ui/Toast.jsx';
import AppHeader from './components/layout/AppHeader.jsx';
import ActiveOrdersSection from './components/orders/ActiveOrdersSection.jsx';
import KanbanBoard from './components/kanban/KanbanBoard.jsx';
import RegistriesSection from './components/registries/RegistriesSection.jsx';
import CandidateModal from './components/modals/CandidateModal.jsx';
import CandidateDetailsModal from './components/modals/CandidateDetailsModal.jsx';
import OrderModal from './components/modals/OrderModal.jsx';
import RepeatOrderModal from './components/modals/RepeatOrderModal.jsx';
import RestoreCandidateModal from './components/modals/RestoreCandidateModal.jsx';
import ConfirmModal from './components/modals/ConfirmModal.jsx';
import BhpDateModal from './components/modals/BhpDateModal.jsx';

function AuthenticatedApp({ currentUser, onLogout }) {
  const {
    candidates,
    loading: candidatesLoading,
    error: candidatesError,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    applyCandidateWorkflow,
    restoreCandidate,
    rollbackCandidate,
    seedCandidates,
  } = useCandidates(currentUser);
  const { orders, loading: ordersLoading, error: ordersError, createOrder, updateOrder, deleteOrder, repeatOrder, seedOrders } = useOrders(currentUser);
  const [registrySearchQuery, setRegistrySearchQuery] = useState('');
  const [registrySelectedDept, setRegistrySelectedDept] = useState('Wszystkie');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderDept, setOrderDept] = useState('Metal');
  const [orderCount, setOrderCount] = useState(1);
  const [orderGender, setOrderGender] = useState('Mężczyźni i kobiety');
  const [orderACDate, setOrderACDate] = useState('');
  const [orderACTime, setOrderACTime] = useState('');
  const [repeatingOrder, setRepeatingOrder] = useState(null);
  const [repeatNewDate, setRepeatNewDate] = useState('');
  const [restoringCandidate, setRestoringCandidate] = useState(null);
  const [restoreNewDate, setRestoreNewDate] = useState('');
  const [bhpCandidate, setBhpCandidate] = useState(null);
  const [bhpModalSource, setBhpModalSource] = useState(null);
  const [bhpDate, setBhpDate] = useState('');
  const [bhpTime, setBhpTime] = useState('');
  const [isSeedConfirmOpen, setIsSeedConfirmOpen] = useState(false);
  const [confirmDeleteOrderModal, setConfirmDeleteOrderModal] = useState({ show: false, id: null });
  const [isClearArchiveConfirmOpen, setIsClearArchiveConfirmOpen] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: '', type: 'info' });
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ show: false, id: null, name: '' });
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAssessmentDate, setFormAssessmentDate] = useState('');
  const [formAssessmentTime, setFormAssessmentTime] = useState('');
  const [formDepartment, setFormDepartment] = useState('Metal');
  const [selectedOrderSelection, setSelectedOrderSelection] = useState('manual');

  const showAlert = (message, type = 'info') => {
    setCustomAlert({ show: true, message, type });
    setTimeout(() => setCustomAlert({ show: false, message: '', type: 'info' }), 4000);
  };

  const todayDateStr = getCurrentDateOnlyString();
  const { activeOrders, inactiveOrders } = useMemo(() => splitOrdersByActivity(orders, todayDateStr), [orders, todayDateStr]);
  const getOrderRealization = (order) => calculateOrderRealization(order, candidates);
  const candidatesForDisplay = useMemo(() => candidates.map(candidate => ({
    ...candidate,
    displayAssessmentDate: getCandidateAssessmentDate(candidate, orders),
    displayAssessmentTime: getCandidateAssessmentTime(candidate, orders),
  })), [candidates, orders]);

  const handleStatusChange = (candidate, newStatus) => {
    if (candidate.stage === 'medical' && newStatus === 'Przeszedł') {
      setBhpCandidate(candidate);
      setBhpModalSource('medical');
      setBhpDate(candidate.bhpDate || '');
      setBhpTime(candidate.bhpTime || '08:00');
      return;
    }
    applyCandidateWorkflow(candidate.id, currentCandidate => changeCandidateStatus(currentCandidate, newStatus));
    showAlert('Zmieniono status kandydata ' + candidate.firstName + ' ' + candidate.lastName + ' na: ' + newStatus, 'success');
  };
  const handleRollbackStage = (candidate, event) => {
    if (event) event.stopPropagation();
    if (candidate.stage !== 'medical' && candidate.stage !== 'bhp') return;
    const targetStage = candidate.stage === 'medical' ? 'assessment' : 'medical';
    rollbackCandidate(candidate.id, currentCandidate => rollbackCandidateStage(currentCandidate));
    showAlert('Cofnięto kandydata do etapu: ' + STAGE_LABELS[targetStage], 'info');
  };
  const returnToMedicalFromReserve = (candidate) => {
    restoreCandidate(candidate.id, currentCandidate => returnToMedicalFromReserveWorkflow(currentCandidate));
    showAlert('Przywrócono ' + candidate.firstName + ' ' + candidate.lastName + ' do etapu Badań lekarskich', 'success');
  };
  const assignBhpFromReserve = (candidate) => {
    setBhpCandidate(candidate);
    setBhpModalSource('reserve');
    setBhpDate(candidate.bhpDate || '');
    setBhpTime(candidate.bhpTime || '08:00');
  };
  const closeBhpModal = () => {
    setBhpCandidate(null);
    setBhpModalSource(null);
    setBhpDate('');
    setBhpTime('');
  };
  const executeBhpAssignment = () => {
    if (!bhpCandidate || !bhpDate) { showAlert('Wybierz datę BHP.', 'info'); return; }
    if (bhpModalSource === 'reserve') {
      applyCandidateWorkflow(bhpCandidate.id, currentCandidate => assignBhpFromReserveWithDate(currentCandidate, bhpDate, bhpTime));
      showAlert('Skierowano ' + bhpCandidate.firstName + ' ' + bhpCandidate.lastName + ' z rezerwy na BHP.', 'success');
    } else {
      applyCandidateWorkflow(bhpCandidate.id, currentCandidate => assignBhpAfterMedical(currentCandidate, bhpDate, bhpTime));
      showAlert('Wyznaczono BHP dla kandydata ' + bhpCandidate.firstName + ' ' + bhpCandidate.lastName + '.', 'success');
    }
    closeBhpModal();
  };
  const executeSendPassedMedicalToReserve = () => {
    if (!bhpCandidate) return;
    applyCandidateWorkflow(bhpCandidate.id, currentCandidate => sendPassedMedicalToReserve(currentCandidate));
    showAlert('Kandydat ' + bhpCandidate.firstName + ' ' + bhpCandidate.lastName + ' trafił do rezerwy ze statusem Badania zaliczone.', 'success');
    closeBhpModal();
  };
  const openRestoreModal = (candidate) => { setRestoringCandidate(candidate); setRestoreNewDate(getCurrentDateOnlyString()); };
  const executeRestoreFromRejections = () => {
    if (!restoreNewDate || !restoringCandidate) { showAlert('Wprowadź poprawną datę.', 'info'); return; }
    restoreCandidate(restoringCandidate.id, currentCandidate => restoreCandidateFromRejections(currentCandidate, restoreNewDate));
    showAlert('Przywrócono kandydata na etap: ' + (restoringCandidate.rejectionStage || 'Assessment (AC)'), 'success');
    setRestoringCandidate(null);
  };

  const openAddModal = () => {
    setEditingCandidate(null); setFormFirstName(''); setFormLastName(''); setFormBirthDate(''); setFormPhone(''); setFormAssessmentTime('');
    const firstOrder = activeOrders[0];
    if (firstOrder) { setSelectedOrderSelection(firstOrder.id); setFormDepartment(firstOrder.department); setFormAssessmentDate(''); setFormAssessmentTime(''); }
    else { setSelectedOrderSelection('manual'); setFormDepartment('Metal'); setFormAssessmentDate(''); }
    setIsAddEditModalOpen(true);
  };
  const openEditModal = (candidate, event) => {
    if (event) event.stopPropagation();
    setEditingCandidate(candidate); setFormFirstName(candidate.firstName); setFormLastName(candidate.lastName); setFormBirthDate(candidate.birthDate || ''); setFormPhone(candidate.phone); setFormAssessmentDate(candidate.assessmentDate || ''); setFormAssessmentTime(candidate.assessmentTime || ''); setFormDepartment(candidate.department); setSelectedOrderSelection(candidate.orderId || 'manual'); setIsAddEditModalOpen(true);
  };
  const handleDeleteCandidate = (candidateId, event) => {
    if (event) event.stopPropagation();
    const candidate = candidates.find(item => item.id === candidateId);
    if (candidate) setConfirmDeleteModal({ show: true, id: candidateId, name: candidate.firstName + ' ' + candidate.lastName });
  };
  const executeCandidateDeletion = () => {
    deleteCandidate(confirmDeleteModal.id);
    setConfirmDeleteModal({ show: false, id: null, name: '' });
    showAlert('Kandydat został usunięty.', 'info');
  };
  const handleSubmitForm = (event) => {
    event.preventDefault();
    const selectedOrder = selectedOrderSelection === 'manual' ? null : orders.find(order => order.id === selectedOrderSelection);
    const candidateData = {
      firstName: formFirstName,
      lastName: formLastName,
      birthDate: formBirthDate,
      phone: formPhone,
      department: selectedOrder ? selectedOrder.department : formDepartment,
      orderId: selectedOrder ? selectedOrder.id : null,
      assessmentDate: selectedOrder ? null : formAssessmentDate,
      assessmentTime: selectedOrder ? null : formAssessmentTime,
    };
    if (editingCandidate) {
      updateCandidate(editingCandidate.id, candidateData);
      showAlert('Zaktualizowano dane kandydata.', 'success');
    } else {
      createCandidate(candidateData);
      showAlert('Dodano kandydata ' + formFirstName + ' ' + formLastName + '.', 'success');
    }
    setIsAddEditModalOpen(false);
  };

  const openAddOrderModal = () => { setEditingOrder(null); setOrderDept('Metal'); setOrderCount(1); setOrderGender('Mężczyźni i kobiety'); setOrderACDate(''); setOrderACTime(''); setIsOrderModalOpen(true); };
  const openEditOrderModal = (order) => { setEditingOrder(order); setOrderDept(order.department); setOrderCount(order.count); setOrderGender(normalizeOrderGender(order.gender)); setOrderACDate(order.assessmentDate || ''); setOrderACTime(order.assessmentTime || ''); setIsOrderModalOpen(true); };
  const saveOrder = (event) => {
    event.preventDefault();
    const orderData = { department: orderDept, count: Number(orderCount), gender: normalizeOrderGender(orderGender), assessmentDate: orderACDate, assessmentTime: orderACTime };
    if (editingOrder) { updateOrder(editingOrder.id, orderData); showAlert('Zamówienie zostało zaktualizowane.', 'success'); }
    else { createOrder(orderData); showAlert('Dodano nowe zapotrzebowanie.', 'success'); }
    setIsOrderModalOpen(false);
  };
  const triggerDeleteOrder = (orderId) => setConfirmDeleteOrderModal({ show: true, id: orderId });
  const executeDeleteOrder = () => { deleteOrder(confirmDeleteOrderModal.id); setIsOrderModalOpen(false); setConfirmDeleteOrderModal({ show: false, id: null }); showAlert('Zamówienie zostało usunięte.', 'info'); };
  const executeClearOrderArchive = () => { orders.filter(order => order.assessmentDate < todayDateStr).forEach(order => deleteOrder(order.id)); setIsClearArchiveConfirmOpen(false); showAlert('Archiwalne zamówienia zostały usunięte.', 'info'); };
  const handleRepeatOrder = (order) => { setRepeatingOrder(order); setRepeatNewDate(''); };
  const executeRepeatOrder = () => {
    if (!repeatNewDate || !repeatingOrder) { showAlert('Wybierz nową datę AC.', 'info'); return; }
    repeatOrder(repeatingOrder.id, repeatNewDate);
    setRepeatingOrder(null);
    showAlert('Zamówienie zostało powtórzone z nową datą.', 'success');
  };
  const executeSeedData = () => { seedCandidates(); seedOrders(); setIsSeedConfirmOpen(false); showAlert('Załadowano dane testowe.', 'info'); };

  const reserveCandidates = useMemo(() => candidatesForDisplay.filter(candidate => candidate.stage === 'reserve'), [candidatesForDisplay]);
  const hiredCandidates = useMemo(() => candidatesForDisplay.filter(candidate => candidate.stage === 'hired'), [candidatesForDisplay]);
  const rejectedCandidates = useMemo(() => candidatesForDisplay.filter(candidate => candidate.stage === 'rejected'), [candidatesForDisplay]);
  const kanbanAssessment = useMemo(() => candidatesForDisplay.filter(candidate => candidate.stage === 'assessment'), [candidatesForDisplay]);
  const kanbanMedical = useMemo(() => candidatesForDisplay.filter(candidate => candidate.stage === 'medical'), [candidatesForDisplay]);
  const kanbanBhp = useMemo(() => candidatesForDisplay.filter(candidate => candidate.stage === 'bhp'), [candidatesForDisplay]);
  const filterRegistryList = (list) => list.filter(candidate => {
    const query = registrySearchQuery.toLowerCase().trim();
    const matchesSearch = !query || candidate.firstName.toLowerCase().includes(query) || candidate.lastName.toLowerCase().includes(query) || candidate.phone.includes(query);
    const matchesDept = registrySelectedDept === 'Wszystkie' || candidate.department === registrySelectedDept;
    return matchesSearch && matchesDept;
  });
  const filteredReserveCandidates = useMemo(() => filterRegistryList(reserveCandidates), [reserveCandidates, registrySearchQuery, registrySelectedDept]);
  const filteredHiredCandidates = useMemo(() => filterRegistryList(hiredCandidates), [hiredCandidates, registrySearchQuery, registrySelectedDept]);
  const filteredRejectedCandidates = useMemo(() => filterRegistryList(rejectedCandidates), [rejectedCandidates, registrySearchQuery, registrySelectedDept]);
  const isDataLoading = candidatesLoading || ordersLoading;
  const dataError = candidatesError || ordersError;
  const selectedEditingOrder = editingCandidate?.orderId ? orders.find(order => order.id === editingCandidate.orderId) : null;
  const candidateOrderOptions = selectedEditingOrder && !activeOrders.some(order => order.id === selectedEditingOrder.id)
    ? [selectedEditingOrder, ...activeOrders]
    : activeOrders;
  const activeViewingCandidate = viewingCandidate
    ? candidatesForDisplay.find(candidate => candidate.id === viewingCandidate.id) || viewingCandidate
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16">
      <Toast alert={customAlert} />
      <AppHeader currentUser={currentUser} onLogout={onLogout} />
      {isDataLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300">Ładowanie danych z Firebase...</div>
        </div>
      )}
      {dataError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
          <div className="bg-rose-950/40 border border-rose-500/20 rounded-xl p-4 text-sm text-rose-200">{dataError}</div>
        </div>
      )}
      <ActiveOrdersSection inactiveOrders={inactiveOrders} activeOrders={activeOrders} getOrderRealization={getOrderRealization} openEditOrderModal={openEditOrderModal} openAddOrderModal={openAddOrderModal} handleRepeatOrder={handleRepeatOrder} triggerDeleteOrder={triggerDeleteOrder} onClearArchive={() => setIsClearArchiveConfirmOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 flex-1 flex flex-col gap-8">
        <KanbanBoard kanbanAssessment={kanbanAssessment} kanbanMedical={kanbanMedical} kanbanBhp={kanbanBhp} openAddModal={openAddModal} handleStatusChange={handleStatusChange} openEditModal={openEditModal} handleDeleteCandidate={handleDeleteCandidate} openDetailsModal={setViewingCandidate} handleRollbackStage={handleRollbackStage} />
        <RegistriesSection registrySearchQuery={registrySearchQuery} setRegistrySearchQuery={setRegistrySearchQuery} registrySelectedDept={registrySelectedDept} setRegistrySelectedDept={setRegistrySelectedDept} filteredReserveCandidates={filteredReserveCandidates} filteredHiredCandidates={filteredHiredCandidates} filteredRejectedCandidates={filteredRejectedCandidates} openDetailsModal={setViewingCandidate} returnToMedicalFromReserve={returnToMedicalFromReserve} assignBhpFromReserve={assignBhpFromReserve} openRestoreModal={openRestoreModal} handleDeleteCandidate={handleDeleteCandidate} />
      </main>
      <footer className="mt-auto pt-16 pb-8 text-center text-xs text-slate-500 flex flex-col items-center gap-3"><p>© 2026 Personnel Tracker. Profesjonalne narzędzie operacyjne HR.</p>{import.meta.env.DEV && <button onClick={() => setIsSeedConfirmOpen(true)} className="text-[10px] text-slate-600 hover:text-slate-400 font-medium uppercase tracking-wider transition-colors border border-slate-800/80 rounded-md px-2.5 py-1 bg-slate-950/40 hover:bg-slate-900/40">Załaduj dane testowe</button>}</footer>
      <CandidateModal isOpen={isAddEditModalOpen} editingCandidate={editingCandidate} handleSubmitForm={handleSubmitForm} activeOrders={candidateOrderOptions} selectedOrderSelection={selectedOrderSelection} setSelectedOrderSelection={setSelectedOrderSelection} getOrderRealization={getOrderRealization} formFirstName={formFirstName} setFormFirstName={setFormFirstName} formLastName={formLastName} setFormLastName={setFormLastName} formBirthDate={formBirthDate} setFormBirthDate={setFormBirthDate} formPhone={formPhone} setFormPhone={setFormPhone} formAssessmentDate={formAssessmentDate} setFormAssessmentDate={setFormAssessmentDate} formAssessmentTime={formAssessmentTime} setFormAssessmentTime={setFormAssessmentTime} formDepartment={formDepartment} setFormDepartment={setFormDepartment} onClose={() => setIsAddEditModalOpen(false)} />
      <CandidateDetailsModal candidate={activeViewingCandidate} onClose={() => setViewingCandidate(null)} />
      <OrderModal isOpen={isOrderModalOpen} editingOrder={editingOrder} saveOrder={saveOrder} orderDept={orderDept} setOrderDept={setOrderDept} orderCount={orderCount} setOrderCount={setOrderCount} orderGender={orderGender} setOrderGender={setOrderGender} orderACDate={orderACDate} setOrderACDate={setOrderACDate} orderACTime={orderACTime} setOrderACTime={setOrderACTime} triggerDeleteOrder={triggerDeleteOrder} onClose={() => setIsOrderModalOpen(false)} />
      <RepeatOrderModal order={repeatingOrder} repeatNewDate={repeatNewDate} setRepeatNewDate={setRepeatNewDate} onClose={() => setRepeatingOrder(null)} onConfirm={executeRepeatOrder} />
      <RestoreCandidateModal candidate={restoringCandidate} restoreNewDate={restoreNewDate} setRestoreNewDate={setRestoreNewDate} onClose={() => setRestoringCandidate(null)} onConfirm={executeRestoreFromRejections} />
      <BhpDateModal candidate={bhpCandidate} bhpDate={bhpDate} setBhpDate={setBhpDate} bhpTime={bhpTime} setBhpTime={setBhpTime} source={bhpModalSource} onConfirm={executeBhpAssignment} onSendToReserve={executeSendPassedMedicalToReserve} onClose={closeBhpModal} />
      <ConfirmModal isOpen={confirmDeleteModal.show} title="Potwierdzenie usunięcia" confirmLabel="Usuń kandydata" onConfirm={executeCandidateDeletion} onCancel={() => setConfirmDeleteModal({ show: false, id: null, name: '' })}>Czy na pewno chcesz usunąć kandydata <strong className="text-white">{confirmDeleteModal.name}</strong> z bazy danych? Działanie to usunie również historię.</ConfirmModal>
      <ConfirmModal isOpen={confirmDeleteOrderModal.show} title="Usuń zamówienie" confirmLabel="Usuń zamówienie" onConfirm={executeDeleteOrder} onCancel={() => setConfirmDeleteOrderModal({ show: false, id: null })}>Czy na pewno chcesz usunąć to zamówienie? Ta akcja jest bezpowrotna.</ConfirmModal>
      <ConfirmModal isOpen={isSeedConfirmOpen} tone="amber" title="Dane testowe" confirmLabel="Załaduj dane" onConfirm={executeSeedData} onCancel={() => setIsSeedConfirmOpen(false)}>Załadowanie danych testowych zastąpi obecnie wprowadzone dane przykładowym zestawem developerskim.</ConfirmModal>
      <ConfirmModal isOpen={isClearArchiveConfirmOpen} title="Wyczyść archiwum zamówień" confirmLabel="Oczyść archiwum" onConfirm={executeClearOrderArchive} onCancel={() => setIsClearArchiveConfirmOpen(false)}>Czy na pewno chcesz usunąć wszystkie archiwalne zamówienia z systemu? Ta akcja jest bezpowrotna.</ConfirmModal>
    </div>
  );
}

export default function App() {
  const { currentUser, loading, error, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-sm text-slate-300">Ładowanie sesji użytkownika...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen authError={error} onLogin={login} />;
  }

  return <AuthenticatedApp currentUser={currentUser} onLogout={logout} />;
}
