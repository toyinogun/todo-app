import { useRef, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import {
  addTask,
  deleteTask,
  editTitle,
  toggleTask,
  validTitle,
  TITLE_MAX,
} from '../../lib/tasks'
import { bannerText } from './banner'
import { TaskRow } from './TaskRow'
import { usePersistedTasks } from './usePersistedTasks'
import './tasks.css'

export function TaskList() {
  const { tasks, setTasks, banner, dismissBanner } = usePersistedTasks()
  const [title, setTitle] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const message = bannerText(banner)
  const left = tasks.filter((t) => !t.done).length

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (validTitle(title) === undefined) return
    setTasks((ts) => addTask(ts, title))
    setTitle('')
  }

  const remove = (id: string) => {
    setTasks((ts) => deleteTask(ts, id))
    input.current?.focus() // the focused delete button is gone; land somewhere useful
  }

  return (
    <main>
      <h1>To do</h1>
      <p className="tagline">Saved on this device. No account, no server.</p>

      {message && (
        <div
          className="banner"
          role={banner?.kind === 'newer' ? 'alert' : 'status'}
        >
          <p>{message}</p>
          <Button onClick={dismissBanner}>Dismiss</Button>
        </div>
      )}

      <form className="add-form" onSubmit={submit}>
        <TextInput
          ref={input}
          label="New task"
          hideLabel
          placeholder="What needs doing?"
          value={title}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>

      {tasks.length === 0 ? (
        <div className="empty">
          <p>Nothing to do yet. Add your first task above.</p>
        </div>
      ) : (
        <>
          <p className="list-meta" aria-live="polite">
            {left === 0 ? 'All done' : `${left} of ${tasks.length} left`}
          </p>
          <ul>
            {tasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                onToggle={(id) => setTasks((ts) => toggleTask(ts, id))}
                onEdit={(id, next) => setTasks((ts) => editTitle(ts, id, next))}
                onDelete={remove}
              />
            ))}
          </ul>
        </>
      )}

      <footer>Your list never leaves this browser.</footer>
    </main>
  )
}
