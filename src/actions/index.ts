export { draw } from './draw'

export { pick } from './pick'
export { select } from './select'
export { move } from './move'
export { rotate } from './rotate'
export { align } from './align'
export { copy } from './copy'
export { insertImage } from './insert-image'

export declare namespace Actions {
  export type PickOptions = import('./pick').PickOptions
  export type SelectOptions = import('./select').SelectOptions
  export type MoveOptions = import('./move').MoveOptions
  export type RotateOptions = import('./rotate').RotateOptions
  export type DrawOptions = import('./draw').DrawOptions
  export type AlignOptions = import('./align').AlignOptions
  export type CopyOptions = import('./copy').CopyOptions
  export type InsertImageOptions = import('./insert-image').InsertImageOptions
}
