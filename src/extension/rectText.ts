import { FigureTemplate } from 'klinecharts'

export interface RectTextAttrs {
  x: number
  y: number
  text: string
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
}

export interface RectTextStyle {
  color?: string
  size?: number
  family?: string
  weight?: string | number
  style?: 'fill' | 'stroke' | 'stroke_fill'
  backgroundColor?: string
  borderColor?: string
  borderSize?: number
  borderRadius?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
}

const rectText: FigureTemplate<RectTextAttrs, RectTextStyle> = {
  name: 'rectText',
  draw: (ctx: CanvasRenderingContext2D, attrs: RectTextAttrs, styles: RectTextStyle) => {
    try {
      if (!ctx || !attrs) return
      const { x, y, text, align = 'center', baseline = 'middle' } = attrs
      if (typeof x !== 'number' || typeof y !== 'number' || text === undefined || text === null) return

      const textStr = String(text)
      if (!textStr.trim()) return

      const safeStyles = styles || {}
      const fontSize = Number(safeStyles.size) || 12
      ctx.font = `${fontSize}px Arial`
      const textWidth = ctx.measureText(textStr).width
      const textHeight = fontSize

      const paddingLeft = Number(safeStyles.paddingLeft) ?? 8
      const paddingRight = Number(safeStyles.paddingRight) ?? 8
      const paddingTop = Number(safeStyles.paddingTop) ?? 4
      const paddingBottom = Number(safeStyles.paddingBottom) ?? 4

      const rectWidth = textWidth + paddingLeft + paddingRight
      const rectHeight = textHeight + paddingTop + paddingBottom

      let rectX: number, textX: number
      if (align === 'left') {
        rectX = x
        textX = x + paddingLeft
      } else if (align === 'right') {
        rectX = x - rectWidth
        textX = x - paddingRight
      } else { // center
        rectX = x - rectWidth / 2
        textX = x
      }

      let rectY: number, textY: number
      if (baseline === 'top') {
        rectY = y
        textY = y + paddingTop + textHeight / 2
      } else if (baseline === 'bottom') {
        rectY = y - rectHeight
        textY = y - paddingBottom - textHeight / 2
      } else { // middle
        rectY = y - rectHeight / 2
        textY = y
      }

      if (isNaN(rectX) || isNaN(rectY) || isNaN(rectWidth) || isNaN(rectHeight) || isNaN(textX) || isNaN(textY)) {
        return
      }

      ctx.save()
      ctx.beginPath()
      const radius = Math.max(0, Number(safeStyles.borderRadius) || 0)

      if ((ctx as any).roundRect) {
        (ctx as any).roundRect(rectX, rectY, rectWidth, rectHeight, radius)
      } else {
        ctx.moveTo(rectX + radius, rectY)
        ctx.lineTo(rectX + rectWidth - radius, rectY)
        ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius)
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius)
        ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight)
        ctx.lineTo(rectX + radius, rectY + rectHeight)
        ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius)
        ctx.lineTo(rectX, rectY + radius)
        ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY)
      }

      if (safeStyles.style === 'fill' || safeStyles.style === 'stroke_fill') {
        ctx.fillStyle = safeStyles.backgroundColor || 'rgba(22, 119, 255, 0.15)'
        ctx.fill()
      }
      if (safeStyles.style === 'stroke' || safeStyles.style === 'stroke_fill') {
        ctx.strokeStyle = safeStyles.borderColor || 'rgba(22, 119, 255, 0.6)'
        ctx.lineWidth = Number(safeStyles.borderSize) || 1
        ctx.stroke()
      }

      ctx.fillStyle = safeStyles.color || '#1677FF'
      ctx.textAlign = align
      ctx.textBaseline = 'middle'
      ctx.fillText(textStr, textX, textY)
      ctx.restore()
    } catch (err) {
      console.error("Error in custom rectText draw:", err)
    }
  }
}

export default rectText
