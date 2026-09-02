import { Button } from './components/Button'
import { Checkbox } from './components/Checkbox'
import { ListRow } from './components/ListRow'
import { TextInput } from './components/TextInput'
import { TrashIcon } from './components/icons'

// Preview of the base pieces. Release 1 (task list) replaces this screen.
function App() {
  return (
    <main>
      <h1>To do</h1>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          alignItems: 'flex-end',
        }}
      >
        <TextInput label="New task" hideLabel placeholder="What needs doing?" />
        <Button variant="primary">Add</Button>
      </div>
      <h2>Preview</h2>
      <ul>
        <ListRow>
          <Checkbox label="Mark done" hideLabel />
          <span className="row-title">Write the design system</span>
          <Button variant="icon" danger aria-label="Delete task">
            <TrashIcon />
          </Button>
        </ListRow>
        <ListRow done>
          <Checkbox label="Mark done" hideLabel defaultChecked />
          <span className="row-title">Scaffold the project</span>
          <Button variant="icon" danger aria-label="Delete task">
            <TrashIcon />
          </Button>
        </ListRow>
      </ul>
    </main>
  )
}

export default App
