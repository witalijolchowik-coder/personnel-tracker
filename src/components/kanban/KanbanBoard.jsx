import { STAGE_LABELS } from '../../data/constants.js';
import KanbanColumn from './KanbanColumn.jsx';

export default function KanbanBoard({ kanbanAssessment, kanbanMedical, kanbanBhp, openAddModal, handleStatusChange, openEditModal, handleDeleteCandidate, openDetailsModal, handleRollbackStage }) {
  const handlers = { onStatusChange: handleStatusChange, onEdit: openEditModal, onDelete: handleDeleteCandidate, onViewDetails: openDetailsModal, onRollback: handleRollbackStage };
  return (
    <section>
      <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />PROCES REKRUTACJI</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KanbanColumn stage="assessment" title={STAGE_LABELS.assessment} candidates={kanbanAssessment} onAddCandidate={openAddModal} {...handlers} />
        <KanbanColumn stage="medical" title={STAGE_LABELS.medical} candidates={kanbanMedical} {...handlers} />
        <KanbanColumn stage="bhp" title={STAGE_LABELS.bhp} candidates={kanbanBhp} {...handlers} />
      </div>
    </section>
  );
}
