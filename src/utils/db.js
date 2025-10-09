import { openDB } from 'idb';

const DB_NAME = 'hockeyTracker';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create a store of objects
      if (!db.objectStoreNames.contains('players')) {
        db.createObjectStore('players', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('assessments')) {
        db.createObjectStore('assessments', { keyPath: 'id' });
      }
    },
  });
};

// Player operations
export const getAllPlayers = async () => {
  const db = await initDB();
  return db.getAll('players');
};

export const savePlayer = async (player) => {
  const db = await initDB();
  return db.put('players', player);
};

export const deletePlayer = async (playerId) => {
  const db = await initDB();
  return db.delete('players', playerId);
};

// Assessment operations
export const getAllAssessments = async () => {
  const db = await initDB();
  return db.getAll('assessments');
};

export const saveAssessment = async (assessment) => {
  const db = await initDB();
  return db.put('assessments', assessment);
};

export const deleteAssessmentsForPlayer = async (playerId) => {
  const db = await initDB();
  const tx = db.transaction('assessments', 'readwrite');
  const store = tx.objectStore('assessments');
  const assessments = await store.getAll();
  
  const deletePromises = assessments
    .filter(assessment => assessment.playerId === playerId)
    .map(assessment => store.delete(assessment.id));
  
  await Promise.all(deletePromises);
  await tx.done;
};

// Data export/import operations
export const exportData = async () => {
  const players = await getAllPlayers();
  const assessments = await getAllAssessments();
  return {
    players,
    assessments,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

export const importData = async (data) => {
  const db = await initDB();
  const tx = db.transaction(['players', 'assessments'], 'readwrite');

  // Clear existing data
  await tx.objectStore('players').clear();
  await tx.objectStore('assessments').clear();

  // Import new data
  const playerPromises = data.players.map(player => 
    tx.objectStore('players').add(player)
  );
  const assessmentPromises = data.assessments.map(assessment => 
    tx.objectStore('assessments').add(assessment)
  );

  await Promise.all([...playerPromises, ...assessmentPromises]);
  await tx.done;
};