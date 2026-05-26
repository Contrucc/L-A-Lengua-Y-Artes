// Configuración de Supabase
const supabaseUrl = 'https://zjnourjlpssxjbrtndxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqbm91cmpscHNzeGpicnRuZHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODU4MDMsImV4cCI6MjA5NTM2MTgwM30.153hHzbc95F3L1mczZCP1roLyW_CF1t08YjiKZTOSwk';

// Crear cliente de Supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Variables globales
window.supabaseClient = supabase;