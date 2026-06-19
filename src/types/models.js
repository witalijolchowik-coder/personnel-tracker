/**
 * @typedef {'assessment'|'medical'|'bhp'|'reserve'|'hired'|'rejected'} Stage
 * @typedef {'admin'|'recruiter'} UserRole
 * @typedef {'Metal'|'Szwalnia'|'Montaż'|'Podsofity/PU'|'Magazyn'} Department
 * @typedef {{ timestamp:string, fromStage:string, toStage:string, fromStatus:string, toStatus:string, actionType?:string, userId?:string|null, userEmail?:string|null, bhpDate?:string|null, source?:string }} CandidateHistoryEntry
 * @typedef {{ id:string, firstName:string, lastName:string, birthDate?:string, phone:string, department:Department, assessmentDate?:string, medicalDate?:string|null, bhpDate?:string|null, hireDate?:string|null, reserveDate?:string|null, reserveStatus?:string|null, rejectionStage?:string|null, rejectionReason?:string|null, rejectionDate?:string|null, stage:Stage, status:string, history:CandidateHistoryEntry[], createdAt:string, updatedAt:string, createdBy?:string|null, updatedBy?:string|null }} Candidate
 * @typedef {{ id:string, department:Department, count:number, gender:'Mężczyźni'|'Kobiety'|'Mężczyźni i kobiety', assessmentDate:string, createdAt:string, updatedAt:string, createdBy?:string|null, updatedBy?:string|null }} Order
 * @typedef {{ id:string, actionType:string, entityType:string, entityId:string, previousValue?:unknown, newValue?:unknown, userId?:string, userEmail?:string, createdAt:string }} ActivityLog
 * @typedef {{ uid:string, email:string, displayName:string, role:UserRole, createdAt:string, updatedAt:string }} User
 */
export {};
