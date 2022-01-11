// export { debug } from './debug'
export { draw } from './draw'
export { pick } from './pick'
export { select } from './select'
export { move } from './move'
export { rotate } from './rotate'
export { align } from './align'
export { copy } from './copy'
export { insertImage } from './insert-image'
export { offset } from './offset'

export interface Actions {
  PickOptions: import('./pick').PickOptions
  SelectOptions: import('./select').SelectOptions
  MoveOptions: import('./move').MoveOptions
  RotateOptions: import('./rotate').RotateOptions
  DrawOptions: import('./draw').DrawOptions
  AlignOptions: import('./align').AlignOptions
  CopyOptions: import('./copy').CopyOptions
  InsertImageOptions: import('./insert-image').InsertImageOptions
  OffsetOptions: import('./offset').OffsetOptions
}
