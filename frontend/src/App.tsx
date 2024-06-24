import React, { useEffect, useState, ChangeEvent } from 'react';
import { getAllActivities, addActivity, updateActivityById, deleteActivityById } from './api';
import './App.css';

interface Activity {
    id: number;
    title: string;
    description: string;
}

const App: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const data = await getAllActivities();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const handleAddOrUpdateActivity = async () => {
        if (isEditing && currentActivityId !== null) {
            const updatedActivity = { title, description };
            try {
                await updateActivityById(currentActivityId, updatedActivity);
                fetchActivities();
                setTitle('');
                setDescription('');
                setIsEditing(false);
                setCurrentActivityId(null);
            } catch (error) {
                console.error('Error updating activity:', error);
            }
        } else {
            const newActivity = { title, description };
            try {
                await addActivity(newActivity);
                fetchActivities();
                setTitle('');
                setDescription('');
            } catch (error) {
                console.error('Error adding activity:', error);
            }
        }
    };

    const handleEditActivity = (activity: Activity) => {
        setTitle(activity.title);
        setDescription(activity.description);
        setIsEditing(true);
        setCurrentActivityId(activity.id);
    };

    const handleDeleteActivity = async (id: number) => {
        try {
            await deleteActivityById(id);
            fetchActivities();
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    return (
        <div id="root">
            <h1>Vynett's List</h1>
            <div>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} 
                />
                <button onClick={handleAddOrUpdateActivity}>
                    {isEditing ? 'Update Activity' : 'Add Activity'}
                </button>
            </div>
            <ul>
                {Array.isArray(activities) && activities.map((activity) => (
                    <li key={activity.id}>
                        <span>{activity.title} - {activity.description}</span>
                        <button onClick={() => handleEditActivity(activity)}>Edit</button>
                        <button onClick={() => handleDeleteActivity(activity.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
