import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pspojkyyepvydqxmsrpg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcG9qa3l5ZXB2eWRxeG1zcnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTkwNTMsImV4cCI6MjA4OTg5NTA1M30.XmuJRasK0v675VilhETe49NLOZN-Uh2n9yNJOnslvqU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
