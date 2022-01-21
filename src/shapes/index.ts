import { DoorOptions } from '@shapes/door'
import { EditableText, EditableTextOptions } from './editable-text'
import Konva from 'konva'
import { Bricks, BricksConfig } from './bricks'
import { Door } from './door'
import { Elevation, ElevationOptions } from './elevation'
import { Flag, FlagOptions } from './flag'
import { FlagLabel, FlagLabelOptions } from './flag-label'
import { FloorLevels, FloorLevelsOptions } from './floor-levels'
import { ImageFollow } from './image-follow'
import Komponent from './komponent'
import { Level, LevelOptions } from './level'
import { SelectBox } from './select-box'
import { SnapButton } from './snap-button'
import { Pointer, PointerOptions } from './pointer'
import { ViewPoint, ViewPointOptions } from './view-point'
import Ruler, { RulerConfig } from './ruler'
import { Maybe } from '@actions/helper'
import { Group } from 'konva/lib/Group'
import CrossCircle, { CrossCircleOptions } from './cross-circle'
import { BasePoint, BasePointOptions } from './base-point'
import { Axis, AxisOptions } from './axis'
import { Nock } from './nock'
import { RectPointer, RectPointerOptions } from './rect-pointer'
import { Segment } from './segment'
import { Path, PathOptions } from './path'
import { Angler, AnglerOptions } from './angler'
import { CompassConfig } from './compass'
import Assistor, { AssistorConfig } from './assistor'

export type Position = [number, number]

// build-in shapes
export interface BuildInEntity extends Konva.ShapeConfig {
  id?: string
  type: string
}

type BuildInShape<Type extends EntityType, Inherit extends Konva.ShapeConfig = Konva.ShapeConfig> = BuildInEntity &
  Inherit & {
    type: Type
  }

export interface CustomEntity extends Konva.ContainerConfig {
  id?: string
  type: string
}

type CustomShape<
  Type extends EntityType,
  Inherit extends Konva.ContainerConfig = Konva.ContainerConfig,
> = CustomEntity &
  Inherit & {
    type: Type
  }

export interface Shapes {
  // build in shapes
  svgPath: BuildInShape<'svgPath'>
  imgUrl: BuildInShape<'imgUrl', Omit<Konva.ImageConfig, 'image'> & { imgUrl: string }>
  img: BuildInShape<'img', Konva.ImageConfig & { image?: CanvasImageSource }>
  text: BuildInShape<'text', Konva.TextConfig>
  line: BuildInShape<'line', Konva.LineConfig>
  rect: BuildInShape<'rect', Konva.RectConfig>
  circle: BuildInShape<'circle', Konva.RectConfig>

  // custom shapes
  angler: CustomShape<'angler', AnglerOptions>
  assistor: CustomShape<'assistor', AssistorConfig>
  axis: CustomShape<'axis', AxisOptions>

  basePoint: CustomShape<'basePoint', BasePointOptions>
  bricks: CustomShape<'bricks', BricksConfig>

  compass: CustomShape<'compass', CompassConfig>
  crossCircle: CustomShape<'crossCircle', CrossCircleOptions>

  door: CustomShape<'door', DoorOptions>

  editableText: CustomShape<'editableText', Konva.TextConfig & EditableTextOptions>
  elevation: CustomShape<'elevation', ElevationOptions>

  flag: CustomShape<'flag', FlagOptions>
  flagLabel: CustomShape<'flagLabel', FlagLabelOptions>
  floorLevels: CustomShape<'floorLevels', FloorLevelsOptions>

  imageFollow: CustomShape<'imageFollow'>

  level: CustomShape<'level', LevelOptions>

  nock: CustomShape<'nock', AxisOptions>

  path: CustomShape<'path', PathOptions>
  pointer: CustomShape<'pointer', PointerOptions>

  rectPointer: CustomShape<'rectPointer', RectPointerOptions>
  ruler: CustomShape<'ruler', RulerConfig>

  snapButton: CustomShape<'snapButton'>
  selectBox: CustomShape<'selectBox'>
  segment: CustomShape<'segment', AxisOptions>
  viewPoint: CustomShape<'viewPoint', ViewPointOptions>
}

export type EntityType = keyof Shapes
export type Entity = Shapes[EntityType]

export interface Layer extends Konva.LayerConfig {
  id: string
  name?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundPosition?: Position
  entities: Array<Entity>
}

export type ShapeOrKomponent = Konva.Shape | Group | Komponent
export type MaybeShapeOrKomponent = Maybe<ShapeOrKomponent>

/**
 * 创建图形的工厂函数
 */
export function createShape(entity: Entity): MaybeShapeOrKomponent
export function createShape(type: EntityType, entity?: Partial<Entity>): MaybeShapeOrKomponent
export function createShape(typeOrEntity: EntityType | Entity, entityOrNot?: Partial<Entity>): MaybeShapeOrKomponent {
  // let type = typeOrEntity
  let entity = entityOrNot
  if (typeof typeOrEntity !== 'string') {
    // type = typeOrEntity.type
    entity = typeOrEntity
  }

  const options = {
    strokeWidth: 1,
    hitStrokeWidth: 6,
    ...entity,
  } as Entity
  const { type } = options

  let shape: MaybeShapeOrKomponent
  if (type === 'imgUrl') {
    const image = new Image()
    image.src = entity?.imgUrl
    shape = new Konva.Image({ image })
    shape.setAttrs(options)
  } else if (type === 'editableText') {
    shape = new EditableText(options)
  } else if (type === 'img') {
    shape = new Konva.Image({ ...options, image: entity?.image })
  } else if (type === 'svgPath') {
    shape = new Konva.Path(options)
  } else if (type === 'text') {
    shape = new Konva.Text(options)
  } else if (type === 'line') {
    shape = new Konva.Line(options)
  } else if (type === 'rect') {
    shape = new Konva.Rect(options)
  } else if (type === 'circle') {
    shape = new Konva.Circle(options)
  } else if (type === 'door') {
    shape = new Door(options)
  } else if (type === 'bricks') {
    shape = new Bricks(options)
  } else if (type === 'flag') {
    shape = new Flag(options)
  } else if (type === 'flagLabel') {
    shape = new FlagLabel(options)
  } else if (type === 'level') {
    shape = new Level(options)
  } else if (type === 'elevation') {
    shape = new Elevation(options)
  } else if (type === 'floorLevels') {
    shape = new FloorLevels(options)
  } else if (type === 'snapButton') {
    shape = new SnapButton(options)
  } else if (type === 'selectBox') {
    shape = new SelectBox(options)
  } else if (type === 'imageFollow') {
    shape = new ImageFollow(options)
  } else if (type === 'pointer') {
    shape = new Pointer(options)
  } else if (type === 'rectPointer') {
    shape = new RectPointer(options)
  } else if (type === 'viewPoint') {
    shape = new ViewPoint(options)
  } else if (type === 'ruler') {
    shape = new Ruler(options)
  } else if (type === 'crossCircle') {
    shape = new CrossCircle(options)
  } else if (type === 'basePoint') {
    shape = new BasePoint(options)
  } else if (type === 'axis') {
    shape = new Axis(options)
  } else if (type === 'nock') {
    shape = new Nock(options)
  } else if (type === 'segment') {
    shape = new Segment(options)
  } else if (type === 'path') {
    shape = new Path(options)
  } else if (type === 'angler') {
    shape = new Angler(options)
  } else if (type === 'assistor') {
    shape = new Assistor(options)
  }
  // @todo 具体化
  // else {
  // shape = new Konva.Shape(config)
  // }

  return shape
}
