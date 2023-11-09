'use client'

import React, { useRef, createRef, useLayoutEffect, useState } from 'react'
import 'gridstack/dist/gridstack.css'
import 'gridstack/dist/gridstack-extra.css'
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack'
// import 'gridstack/dist/gridstack-all'

interface ItemProps {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  onDelete?: () => void
}

const Item: React.FC<ItemProps> = ({ id, onDelete }) => (
  <div>
    <p>{id}</p>
    <button className="bg-red-500 p-2" onClick={onDelete}>
      Delete
    </button>
  </div>
)

interface ControlledStackProps {
  items: Array<ItemProps>
  addItem: (item: ItemProps) => void
  changeItems: (items: Array<ItemProps>) => void
}

export default function Dashboard() {
  const [items1, setItems1] = useState<ItemProps[]>([])
  // const maxX1 = useRef(Math.max(...items1.map((item) => item.x + (item.w ?? 0))))
  // const maxY1 = useRef(Math.max(...items1.map((item) => item.y + (item.h ?? 0))))

  const addItemToGrid1 = () => {
    setItems1((prevItems) => {
      const newId = `item-${items1.length + 1}`

      // // Find the last item in the previous column (if any)
      // const lastItemInColumn = prevItems
      //   .filter((item) => item.x + (item.w ?? 0) === maxX1.current)
      //   .reduce((prev, current) => (prev.y > current.y ? prev : current), { y: -1 }) as ItemProps

      // const newX =
      //   lastItemInColumn.x === -1 ? maxX1.current : lastItemInColumn.x + (lastItemInColumn.w ?? 0)
      // const newY = lastItemInColumn.y === -1 ? maxY1.current : lastItemInColumn.y

      const newItem: ItemProps = {
        id: newId,
        x: 0,
        y: 0,
        w: 6,
        h: 2,
      }

      // Update the maximum x and y values for the next item
      // maxX1.current = Math.max(maxX1.current + 1, newX + 1)
      // maxY1.current = Math.max(maxY1.current, newY + 1)

      return [...prevItems, newItem]
    })
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <button
          className="text-sm font-bold bg-violet-700 text-violet-50 rounded-lg py-2 px-4"
          onClick={addItemToGrid1}>
          Add Block
        </button>
      </div>
      <div className="w-full flex">
        <ControlledStack
          items={items1}
          addItem={(item) => {
            setItems1((items) => [...items, item])
          }}
          changeItems={(items) => setItems1(items)}
        />
      </div>
    </div>
  )
}

const ControlledStack: React.FC<ControlledStackProps> = ({ items, addItem, changeItems }) => {
  const refs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const gridRef = useRef<GridStack | null>(null)
  const gridContainerRef = useRef<HTMLDivElement | null>(null)

  const _ignoreCB = useRef<boolean | undefined>(false)

  refs.current = {}

  if (Object.keys(refs.current).length !== items.length) {
    items.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef()
    })
  }

  useLayoutEffect(() => {
    if (!gridRef.current) {
      const grid = (gridRef.current = GridStack.init(
        {
          float: false,
          acceptWidgets: true,
          disableOneColumnMode: true,
          column: 6,
          minRow: 1,
        },
        gridContainerRef.current!
      )
        .on('added', (ev: any, gsItems: any) => {
          if (_ignoreCB) return

          gsItems.forEach((n: any) => {
            grid.removeWidget(n.el, true, false)
            addItem({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h })
          })
        })
        .on('removed change', (ev: any, gsItems: any) => {
          const newItems = grid.save(false) as GridStackOptions // Save as GridStackOptions
          const widgetArray = newItems as GridStackWidget[] // Extract the array of widgets

          changeItems(
            widgetArray.map((widget) => ({
              id: widget.id ?? '',
              x: widget.x ?? 0,
              y: widget.y ?? 0,
              w: widget.w ?? 1,
              h: widget.h ?? 1,
            }))
          )
        }))
    } else {
      const grid = gridRef.current
      const layout = items.map((a) => {
        const ref = refs.current[a.id].current
        if (ref && 'gridstackNode' in ref) {
          // If 'gridstackNode' is available, use it
          return { ...a, el: ref }
        } else {
          // Otherwise, use the original object
          return { ...a, el: ref }
        }
      })

      _ignoreCB.current = true
      grid.load(layout)
      _ignoreCB.current = undefined
    }
  }, [items, addItem, changeItems])

  return (
    <div style={{ width: '100%', marginRight: '10px' }}>
      <div className="grid-stack" ref={gridContainerRef}>
        {items.map((item) => (
          <div
            ref={refs.current[item.id]}
            key={item.id}
            className="grid-stack-item"
            gs-id={item.id}
            gs-w={item.w}
            gs-h={item.h}
            gs-x={item.x}
            gs-y={item.y}>
            <div className="grid-stack-item-content">
              <Item
                {...item}
                onDelete={() => {
                  const updatedItems = items.filter((i) => i.id !== item.id)
                  changeItems(updatedItems)
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <code>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </code>
    </div>
  )
}
