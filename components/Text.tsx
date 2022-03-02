import React, { useState, useEffect, Fragment, useContext } from 'react'
import { Context } from '../context/CalcValueContext'
import { CalcProps } from '../types'
import { formatMoney } from '../helpers'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'

interface ValidationObj {
  min: number
  max: number
}

interface FieldInputProps {
  increment: number
  defaultValue: any
  showArrows?: boolean
  bounds: ValidationObj
  type: 'money' | 'percent' | 'year'
}

const friendlyFieldString = ({
  increment,
  defaultValue,
  type
}: FieldInputProps) => {
  if (type === 'money') {
    let tmp = formatMoney(defaultValue.value)

    return `${tmp}`
  } else if (type === 'percent') {
    return `${defaultValue.value}%`
  } else {
    return `${defaultValue.value}`
  }
}

export default function Text (props: FieldInputProps) {
  const { increment, type, defaultValue, showArrows, bounds } = props
  const [context, setContext] = useContext(Context)

  let fieldstr = friendlyFieldString(props)

  const [text, setText] = useState<string>(fieldstr)
  const [count, setCount] = useState<any>(defaultValue.value)
  const [visible, setVisible] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (count === '') return

    let fieldstr = friendlyFieldString({
      increment,
      defaultValue: {
        name: defaultValue.name,
        value: count
      },
      type,
      showArrows,
      bounds
    })
    context[defaultValue.name] = count

    setText(fieldstr)
    setContext(context)
  }, [increment, type, count, bounds, context])

  function increase () {
    let newCount = count + increment

    if (newCount > bounds.max) {
      setError(`Must be between ${bounds.min} and ${bounds.max}`);

      return;
    } else {
      setError('');
    }

    setCount(newCount)
  }

  function decrease () {
    let newCount = count - increment

    if (newCount < bounds.min) {
      setError(`Must be between ${bounds.min} and ${bounds.max}`);

      return;
    } else {
      setError('');
    }

    setCount(newCount)
  }

  function change (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      let newCount: number = parseInt(e.target.value)


      if (newCount > bounds.max || newCount < bounds.min) {
        setError(`Must be between ${bounds.min} and ${bounds.max}`);

        return;
      } else {
        setError('');
      }

      setCount(newCount)
    } else {
      setCount('')
    }
  }

  function toggle (isVisible: boolean) {
    if (!count) {
      setCount(bounds.min);
    }
    setError('');
    setVisible(isVisible);
  }
  
  return (
    <Fragment>
      <div className='w-auto inline-block'>
        <div className='flex h-12'>
          {!visible && (
            <Fragment>
              <strong
                onClick={() => toggle(!visible)}
                className='font-bold text-5xl text-slate-800 inline-block underline cursor-pointer'
              >
                {text}
              </strong>
              {showArrows && (
                <div className='flex flex-col justify-center'>
                  <ChevronUpIcon
                    onClick={increase}
                    className='h-5 w-5 inline-block text-slate-500 cursor-pointer'
                  />
                  <ChevronDownIcon
                    onClick={decrease}
                    className='h-5 w-5 inline-block text-slate-500 cursor-pointer'
                  />
                </div>
              )}
            </Fragment>
          )}
          {visible && (
            <input
              className='border font-bold text-5xl text-slate-800 w-48 shadow-sm'
              type='number'
              value={count}
              autoFocus
              onBlur={() => toggle(!visible)}
              onChange={change}
            />
          )}
        </div>
      </div>
      {error && <label className='block mt-2 text-red-500'>{error}</label>}
    </Fragment>
  )
}
