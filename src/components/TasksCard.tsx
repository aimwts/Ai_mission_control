import React, { useEffect, useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LayoutGrid, Plus, MoreVertical } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';

interface SortableItemProps {
  task: Task;
  onDelete: (id: string) => void;
}

function SortableTask({ task, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-white border border-black/5 rounded-xl shadow-sm hover:border-indigo-200 transition-colors group relative"
    >
      <div className="flex items-center justify-between">
        <div {...attributes} {...listeners} className="flex-1 cursor-grab active:cursor-grabbing">
          <span className="text-sm font-medium text-gray-700">{task.title}</span>
        </div>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-1 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function TasksCard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const persistTasks = (newTasks: Task[]) => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTasks)
    });
  };

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle.trim(),
      status: 'todo'
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    persistTasks(updatedTasks);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    persistTasks(updatedTasks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        persistTasks(newItems);
        return newItems;
      });
    }
  };

  const columns = [
    { id: 'todo', label: 'To Do', color: 'bg-slate-100' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-indigo-50' },
    { id: 'done', label: 'Done', color: 'bg-emerald-50' }
  ] as const;

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Tasks</h2>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            isAdding ? "bg-gray-200 text-gray-600" : "bg-indigo-600 text-white hover:bg-indigo-700"
          )}
        >
          <Plus className={cn("w-4 h-4 transition-transform", isAdding && "rotate-45")} />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-[600px]">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {columns.map(col => (
              <div key={col.id} className="flex-1 flex flex-col min-w-[180px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{col.label}</span>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === col.id).length}
                  </span>
                </div>
                <div className={cn("flex-1 rounded-xl p-2 space-y-2", col.color)}>
                  {col.id === 'todo' && isAdding && (
                    <form onSubmit={handleAddTask} className="mb-2">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onBlur={() => !newTaskTitle && setIsAdding(false)}
                        className="w-full p-2 text-sm border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </form>
                  )}
                  <SortableContext 
                    items={tasks.filter(t => t.status === col.id).map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks.filter(t => t.status === col.id).map(task => (
                      <SortableTask key={task.id} task={task} onDelete={handleDeleteTask} />
                    ))}
                  </SortableContext>
                </div>
              </div>
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
}
