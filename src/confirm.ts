import { dispatch, stopEverything } from './utils/events'
import { addListeners, removeListeners, attachObserverCallback } from './utils/dom'
import { EventQueryInterface, MrujsPluginInterface } from '../types'

export function Confirm (): MrujsPluginInterface {
  const callbacks = [handleConfirm] as EventListener[]
  let queries: EventQueryInterface[] = []

  function initialize (): void {
    queries = getQueries()
  }

  function connect (): void {
    addListeners(queries, callbacks)
  }

  function disconnect (): void {
    removeListeners(queries, callbacks)
  }

  function observerCallback (nodeList: Node[]): void {
    attachObserverCallback(queries, nodeList, callbacks)
  }

  return {
    name: 'Confirm',
    initialize,
    connect,
    disconnect,
    observerCallback,
    queries,
    callbacks
  }
}

export function handleConfirm (event: Event | CustomEvent): void {
  if (event.currentTarget == null) return

  const element = event.currentTarget as HTMLElement
  const message = element.dataset.confirm

  if (message == null) return

  let answer = false

  try {
    answer = window.mrujs.confirm(message)
  } catch (e) {
    console.warn('there was an error with mrujs.confirm')
  }

  if (answer) {
    dispatch.call(element, 'confirm:complete', { detail: { answer } })
    return
  }

  stopEverything(event)
}

function getQueries (): EventQueryInterface[] {
  const { linkClickSelector, buttonClickSelector, formInputClickSelector, inputChangeSelector, formSubmitSelector } = window.mrujs
  return [
    {
      event: 'click',
      selectors: [
        linkClickSelector,
        buttonClickSelector,
        formInputClickSelector
      ]
    },
    {
      event: 'change',
      selectors: [
        inputChangeSelector
      ]
    },
    {
      event: 'submit',
      selectors: [
        formSubmitSelector
      ]
    }
  ]
}
