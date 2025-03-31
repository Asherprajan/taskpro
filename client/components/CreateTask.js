'use client';
import { useState } from 'react';

export default function CreateTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch('/api/tasks', {
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
            console.log('Task created:', data);
            // Clear form or update task list
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                required
            />
            <button type="submit">Create Task</button>
        </form>
    );
} 