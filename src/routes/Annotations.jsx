import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useNavigate } from 'react-router-dom'
import { FirebaseContext } from '../hooks/FirebaseProvider'
import { FocusedNotebookContext } from '../hooks/FocusedNotebookProvider'
import GoBack from '../images/icons/go-back.png'
import AddCode from '../images/icons/add-code.png'
import AddNote from '../images/icons/add-note.png'
import DeleteSection from '../images/icons/delete-section.png'
import SaveNotebook from '../images/icons/save-notebook.png'
import SetRowView from '../images/icons/set-row-view.png'
import SetColumnView from '../images/icons/set-column-view.png'
import Alert from './components/Alert'
import '../styles/Annotations.css'

const Annotations = () => {
  const navigate = useNavigate()

  const { db } = useContext(FirebaseContext)
  const { focusedNotebook } = useContext(FocusedNotebookContext)

  const [saved, setSaved] = useState(false)
  const [display, setDisplay] = useState()

  const alertRef = useRef(null)

  const [notebookId, setNotebookId] = useState()
  const [notebook, setNotebook] = useState({
    userId: focusedNotebook.userId,
    color: focusedNotebook.color,
    title: focusedNotebook.title,
    lastEdited: '',
    notebook: [],
  })

  useEffect(() => {
    if (saved) {
      disableBodyScroll(alertRef.current)
    } else {
      enableBodyScroll(alertRef.current)
    }
  }, [saved])

  useEffect(() => {
    if (db) {
      onSnapshot(query(collection(db, 'Notebooks')), (snapshot) => {
        snapshot.docs.forEach((document) => {
          const data = document.data()
          if (
            data.userId === focusedNotebook.userId &&
            data.title === focusedNotebook.title
          ) {
            setNotebook(data)
            setNotebookId(document.id)
          }
        })
      })
    }
  }, [db])

  const addSection = (sectionType) => {
    if (notebook.notebook.length === 0) {
      setNotebook({ ...notebook, notebook: [{ sectionType, value: '' }] })
    } else {
      setNotebook({
        ...notebook,
        notebook: [...notebook.notebook, { sectionType, value: '' }],
      })
    }
  }

  const removeSection = () => {
    setNotebook((previousNotebook) => {
      const temp = [...previousNotebook.notebook]
      temp.pop()
      return { ...notebook, notebook: temp }
    })
  }

  const saveNotebook = async () => {
    const userNotebook = doc(db, 'Notebooks', notebookId)
    const newFields = { ...notebook, notebook: notebook.notebook }
    await updateDoc(userNotebook, newFields)
    setSaved(true)
  }

  const gridDisplay = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    justifyContent: 'center',
  }

  const flexDisplay = {
    display: 'flex',
    flexDirection: 'column',
  }

  const switchDisplay = (option) => {
    if (option === 'grid') {
      setDisplay(gridDisplay)
    } else if (option === 'flex') {
      setDisplay(flexDisplay)
    }
  }

  return (
    <div className="annotations-container">
      <div className="editor">
        <button
          className="boton"
          type="button"
          onClick={() => navigate('/main')}
        >
          <img src={GoBack} alt="Botón para volver al menú" />
          Regresar
        </button>
        <button
          className="boton"
          type="button"
          onClick={() => addSection('code')}
        >
          <img src={AddCode} alt="Botón para agregar código" />
          Agregar código
        </button>
        <button
          className="boton"
          type="button"
          onClick={() => addSection('text')}
        >
          <img src={AddNote} alt="Botón para agregar notas" />
          Agregar nota
        </button>
        <button className="boton" type="button" onClick={removeSection}>
          <img src={DeleteSection} alt="Botón para borrar una sección" />
          Borrar sección
        </button>
        <button
          className="boton"
          type="button"
          onClick={() => saveNotebook(notebook.title)}
        >
          <img src={SaveNotebook} alt="Botón para guardar el cuaderno" />
          Guardar cuaderno
        </button>
        <button
          type="button"
          className="boton"
          onClick={() => switchDisplay('flex')}
        >
          <img src={SetRowView} alt="Botón para cambiar la vista a filas" />
          Ver por filas
        </button>
        <button
          type="button"
          className="boton"
          onClick={() => switchDisplay('grid')}
        >
          <img src={SetColumnView} alt="Botón para cambiar la vista a columnas" />
          Ver por columnas
        </button>
      </div>
      <div className="paper">
        <div className="paper-container" style={display}>
          {notebook.notebook.map((contentBlock, index) => (
            (contentBlock.sectionType === 'code') ? (
              <CodeEditor
                key={index.toString()}
                className="code-area"
                style={{ fontFamily: 'monospace', fontSize: '18px' }}
                value={contentBlock.value}
                language="js"
                padding={10}
                onChange={(event) => {
                  setNotebook((previousState) => {
                    const temp = [...previousState.notebook]
                    temp[index].value = event.target.value
                    return { ...notebook, notebook: temp, }
                  })
                }}
              />
            ) : (
              <textarea
                key={index.toString()}
                className="notes-area"
                value={contentBlock.value}
                onChange={(event) => {
                  setNotebook((previousState) => {
                    const temp = [...previousState.notebook]
                    temp[index].value = event.target.value
                    return { ...notebook, notebook: temp, }
                  })
                }}
              />
            )
          ))}
        </div>
      </div>
      {(saved) ? (
        <div className="saved-alert-background">
          <Alert
            alertTitle="¡Cuaderno guardado!"
            alertText="El cuaderno se ha guardado con éxito. Ya puedes cerrar el cuaderno sin preocuparte."
            closeFunction={setSaved}
          />
        </div>
      ) : (
        null
      )}
    </div>
  )
}

export default Annotations
