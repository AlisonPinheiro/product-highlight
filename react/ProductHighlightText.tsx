import type { FC, ReactNode } from 'react'
import React, { useMemo } from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import { useHighlight } from './ProductHighlights'

interface Props {
  message: string
  markers?: string[]
  blockClass?: string
  link?: string
}

interface MessageValues {
  highlightName: ReactNode
}

const CSS_HANDLES = ['productHighlightText'] as const

const ProductHighlightText: FC<Props> = ({
  message = '',
  markers = [],
  link = '',
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const value = useHighlight()
  const intl = useIntl()

  const values = useMemo(() => {
    const result: MessageValues = {
      highlightName: '',
    }

    if (!value) {
      return result
    }
    const isFlag = value?.highlight.name.startsWith('flag-')

    if (isFlag) {
      const modifiedName = useMemo(() => {
        const formattedName = value?.highlight.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9]/g, '')
          .replace(/\s/g, '')
        return `flag-${formattedName?.toLowerCase()}`
      }, [value?.highlight.name])

      result.highlightName = (
        <img
          src={`/arquivos/${modifiedName}.png`}
          alt={value.highlight.name}
          key="highlightName"
          data-highlight-name={value.highlight.name}
          data-highlight-id={value.highlight.id}
          data-highlight-type={value.type}
        />
      )
    } else {
      result.highlightName = (
        <span
          key="highlightName"
          data-highlight-name={value.highlight.name}
          data-highlight-id={value.highlight.id}
          data-highlight-type={value.type}
          className={handles.productHighlightText}
        >
          {value.highlight.name}
        </span>
      )
    }

    return result
  }, [value, link, intl, handles.productHighlightText])

  if (!value || !message) {
    return null
  }
  console.log(value, 'values')
  return (
    <IOMessageWithMarkers
      handleBase="productHighlightText"
      message={message}
      markers={markers}
      values={values}
    />
  )
}

export default ProductHighlightText
