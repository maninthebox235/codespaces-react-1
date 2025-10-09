import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Players
export const getPlayers = async () => {
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return players;
};

export const savePlayer = async (player) => {
  const { data, error } = await supabase
    .from('players')
    .upsert({
      id: player.id,
      name: player.name,
      age_group: player.age,
      position: player.position
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePlayer = async (playerId) => {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', playerId);
  
  if (error) throw error;
};

// Assessments
export const getAssessments = async () => {
  const { data: assessments, error } = await supabase
    .from('assessments')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return assessments;
};

export const saveAssessment = async (assessment) => {
  const { data, error } = await supabase
    .from('assessments')
    .upsert({
      id: assessment.id,
      player_id: assessment.playerId,
      date: assessment.date,
      type: assessment.type,
      assessor: assessment.assessor,
      metrics: assessment.metrics,
      notes: assessment.notes
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteAssessmentsForPlayer = async (playerId) => {
  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('player_id', playerId);
  
  if (error) throw error;
};

// Backup and Restore
export const exportData = async () => {
  const [players, assessments] = await Promise.all([
    getPlayers(),
    getAssessments()
  ]);

  return {
    players,
    assessments,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

export const importData = async (data) => {
  const { error: clearPlayersError } = await supabase
    .from('players')
    .delete()
    .neq('id', 'dummy'); // Delete all

  if (clearPlayersError) throw clearPlayersError;

  const { error: playersError } = await supabase
    .from('players')
    .upsert(data.players);

  if (playersError) throw playersError;

  const { error: assessmentsError } = await supabase
    .from('assessments')
    .upsert(data.assessments);

  if (assessmentsError) throw assessmentsError;
};