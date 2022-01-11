import { isShape, isString } from '@actions/helper'
import Komponent from '@shapes/komponent'
import { Container } from 'konva/lib/Container'
import { Group } from 'konva/lib/Group'
import { Layer } from 'konva/lib/Layer'
import { Node } from 'konva/lib/Node'
import { Shape } from 'konva/lib/Shape'
import { Stage } from 'konva/lib/Stage'

export type ContainerTypes = Stage | Layer | Group | Komponent | Container
type ContainerOrShape = ContainerTypes | Shape

const matchAttribute = (node: Node, key: string, value: any, op: string) => {
  const property = node.getAttr(key)
  switch (op) {
    case '=':
      return property === value
    case '!=':
      return property !== value
    case '^=':
      return isString(property) && property.startsWith(value)
    case '$=':
      return isString(property) && property.endsWith(value)
    case '*=':
      return isString(property) && property.indexOf(value) >= 0
    case '~=':
      return isString(property) && property.split(/\s+/g).indexOf(value) >= 0
    default:
      return Object.hasOwnProperty.call(node.attrs, key)
  }
}

const findPseudoNode = (nodes: ContainerOrShape[], op: string, operand?: string | number) => {
  switch (op) {
    case 'eq': {
      return operand ? [nodes[Number(operand)]] : null
    }
    case 'first-child': {
      return [nodes[0]]
    }
    case 'last-child': {
      return [nodes[nodes.length - 1]]
    }
    case 'has': {
      return isString(operand) ? nodes.filter(node => query(node, operand).length) : null
    }
  }
  return null
}

const coreSelectorPattern = /^([.#]?[a-zA-Z_0-9-]+)/
const attrSelectorPattern = /^\[([^^!|~*$=]+)(([\^!|~*$]?=)['"]?([^"'\]]+)['"]?)?\]/
const pseudoSelectorPattern = /^:(eq|first-child|has)(\(([^)]+)\))?/

export const find = (container: ContainerOrShape, selector: string) => {
  const coreSelector = selector.match(coreSelectorPattern)
  let nodes = [] as ContainerOrShape[]
  if (coreSelector) {
    // 拿掉 coreSelector
    selector = selector.replace(coreSelector[0], '')
    if (!isShape(container)) {
      nodes = container.find(coreSelector[1])
    }
  }

  if (!nodes?.length) {
    return nodes
  }
  const attrSelector = selector.match(attrSelectorPattern)
  if (attrSelector) {
    const key = attrSelector[1]
    const op = attrSelector[3]
    const value = attrSelector[4]
    return nodes.filter(node => matchAttribute(node, key, value, op))
  }

  const pseudoSelector = selector.match(pseudoSelectorPattern)
  if (pseudoSelector) {
    const foundNodes = findPseudoNode(nodes, pseudoSelector[1], pseudoSelector[3])
    if (foundNodes) {
      nodes = foundNodes
    }
  }

  return nodes
}

/**
 * 层级选择器
 * 示例：
 * ```ts
 * query(stage, '.floor-levels-elevation') // class name
 * query(stage, '#id-1') // id
 * query(stage, 'EditableText') // node type
 * query(stage, '.a .b') // => [.b]  级联选择器
 * query(stage, '.a:first-child') // => [.a:first-child]  伪类选择器
 * query(stage, '.a:eq(1)') // => [.a:eq(1)]  带参数的伪类选择器
 * query(stage, '.a:has(Text[text="F1"])') // => [.a] 返回所有包含 Text[text="F1"] 子元素的 [.a]
 * query(stage, '.a:first-child .b') => [.b] // stage -> .a:first-child -> .b 级联与伪类组合
 * query(stage, '.floor-levels-elevation:first-child EditableText') => [EditableText] // stage -> .a:floor-levels-elevation -> EditableText
 * ```
 */
export const query = (container: ContainerOrShape, selector: string) => {
  const selectors = selector.split(/\s+/g)
  let nodes = [container]

  while (selectors.length) {
    const s = selectors.shift()
    nodes = nodes.reduce((acc, node) => find(node, s as string), [] as ContainerOrShape[])
    if (!nodes.length) return nodes
  }

  return nodes
}
