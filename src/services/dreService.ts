import { supabase } from '@/lib/supabase';
import { DreEntry, DreInput } from '@/types/dre';

export async function fetchEntries(): Promise<DreEntry[]> {
  const { data, error } = await supabase
    .from('dre_entries')
    .select('*')
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as DreEntry[];
}

export async function createEntry(input: DreInput): Promise<DreEntry> {
  const { data, error } = await supabase
    .from('dre_entries')
    .insert({
      description: input.description.trim(),
      category: input.category.trim(),
      type: input.type,
      amount: input.amount,
      entry_date: input.entry_date,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DreEntry;
}

export async function updateEntry(id: string, input: DreInput): Promise<DreEntry> {
  const { data, error } = await supabase
    .from('dre_entries')
    .update({
      description: input.description.trim(),
      category: input.category.trim(),
      type: input.type,
      amount: input.amount,
      entry_date: input.entry_date,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DreEntry;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from('dre_entries').delete().eq('id', id);
  if (error) throw error;
}
