import { useState } from 'react'
import { TaskRow } from '../features/tasks/TaskRow'
import {
  addTask,
  deleteTask,
  editTitle,
  toggleTask,
  type Task,
} from '../lib/tasks'
import '../features/tasks/tasks.css'

// Spec 0004: three sample tasks on the real row pieces, in memory only.
// Never imports storage.ts; a reload reseeds.
const seed = (): readonly Task[] => {
  const first = addTask([], 'Buy milk')
  const done = toggleTask(first, first[0].id)
  return ['Book the dentist', 'Reply to Sam'].reduce(addTask, done)
}

export function Demo() {
  const [tasks, setTasks] = useState(seed)
  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onToggle={(id) => setTasks((ts) => toggleTask(ts, id))}
          onEdit={(id, next) => setTasks((ts) => editTitle(ts, id, next))}
          onDelete={(id) => setTasks((ts) => deleteTask(ts, id))}
        />
      ))}
    </ul>
  )
}
