import { useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Checkbox } from '../../components/Checkbox'
import { ListRow } from '../../components/ListRow'
import { TextInput } from '../../components/TextInput'
import { TrashIcon } from '../../components/icons'
import type { Task } from '../../lib/tasks'

export interface TaskRowProps {
  readonly task: Task
  readonly onToggle: (id: string) => void
  readonly onEdit: (id: string, title: string) => void
  readonly onDelete: (id: string) => void
}

export function TaskRow({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  const [draft, setDraft] = useState<string | undefined>(undefined)
  const cancelled = useRef(false)
  const editing = draft !== undefined

  const commit = () => {
    if (!cancelled.current && draft !== undefined) onEdit(task.id, draft)
    cancelled.current = false
    setDraft(undefined)
  }

  return (
    <ListRow done={task.done}>
      <Checkbox
        label={
          task.done
            ? `Mark "${task.title}" not done`
            : `Mark "${task.title}" done`
        }
        hideLabel
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      {editing ? (
        <TextInput
          label="Edit task"
          hideLabel
          autoFocus
          value={draft}
          maxLength={500}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              cancelled.current = true
              setDraft(undefined)
            }
          }}
        />
      ) : (
        <Button
          className="row-title"
          aria-label={`Edit "${task.title}"`}
          onClick={() => setDraft(task.title)}
        >
          {task.title}
        </Button>
      )}
      <Button
        variant="icon"
        danger
        aria-label={`Delete "${task.title}"`}
        onClick={() => onDelete(task.id)}
      >
        <TrashIcon />
      </Button>
    </ListRow>
  )
}
