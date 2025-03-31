import { NextResponse } from 'next/server';

export async function POST(request) {
    const { title, description } = await request.json();
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description })
        });

        if (!res.ok) {
            throw new Error('Failed to create task');
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 