-- Add outreach status columns to leads
alter table leads add column if not exists outreach_status text default 'idle'; -- idle, queued, processing, sent, failed
alter table leads add column if not exists outreach_scheduled_at timestamptz;
alter table leads add column if not exists outreach_results jsonb default '{}'::jsonb;

-- Index for queue processing
create index if not exists leads_outreach_status_idx on leads(outreach_status);
