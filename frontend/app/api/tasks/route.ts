import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Zod Schema for strict input validation
const TaskSchema = z.object({
  task_description: z.string().min(1, "Task description is required"),
  due_date: z.string().nullable().optional(),
  requires_print: z.boolean().default(false),
  is_completed: z.boolean().default(false),
  user_id: z.string().uuid("Invalid User ID"),
  source_context: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    // Basic auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // We expect Bearer token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const body = await req.json();
    
    // Zod Validation
    const validatedData = TaskSchema.parse({
      ...body,
      user_id: user.id
    });

    // We use the service key (or anon key) but explicitly set the user context
    // RLS handles the security since we are passing the authenticated user's JWT if configured properly.
    // However, since we validated the user on the server, we can safely insert.
    const { data, error } = await supabase
      .from('action_items')
      .insert([validatedData])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: data[0] }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as any).errors }, { status: 400 });
    }
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    // Fetch tasks only for this user
    const { data, error } = await supabase
      .from('action_items')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true, nullsFirst: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
