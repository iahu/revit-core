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
import { SvgButton } from './svg-button'
import { Pointer, PointerOptions } from './pointer'
import { ViewPoint, ViewPointOptions } from './view-point'
import Ruler, { RulerConfig } from './ruler'
import { Maybe } from '@actions/helper'
import { Group } from 'konva/lib/Group'
import CrossCircle, { CrossCircleOptions } from './cross-circle'
import { BasePoint, BasePointOptions } from './base-point'
import { Axis, AxisOptions } from './axis'
import { Nock } from './nock'

export type Position = [number, number]

// build-in shapes
export interface BaseEntity extends Konva.ShapeConfig {
  id?: string
  type: string
}

type CustomShape<Type extends EntityType, Inherit extends Konva.ShapeConfig = Konva.ShapeConfig> = BaseEntity &
  Inherit & {
    type: Type
  }

export interface Shapes {
  // build in shapes
  svgPath: CustomShape<'svgPath'>
  imgUrl: CustomShape<'imgUrl', Omit<Konva.ImageConfig, 'image'> & { imgUrl: string }>
  img: CustomShape<'img', Konva.ImageConfig & { image?: CanvasImageSource }>
  text: CustomShape<'text', Konva.TextConfig>
  line: CustomShape<'line', Konva.LineConfig>
  rect: CustomShape<'rect', Konva.RectConfig>
  circle: CustomShape<'circle', Konva.RectConfig>

  // custom shapes
  editableText: CustomShape<'editableText', Konva.TextConfig & EditableTextOptions>
  door: CustomShape<'door', DoorOptions>
  bricks: CustomShape<'bricks', BricksConfig>
  flag: CustomShape<'flag', FlagOptions>
  flagLabel: CustomShape<'flagLabel', FlagLabelOptions>
  level: CustomShape<'level', LevelOptions>
  elevation: CustomShape<'elevation', ElevationOptions>
  floorLevels: CustomShape<'floorLevels', FloorLevelsOptions>
  ruler: CustomShape<'ruler', RulerConfig>
  svgButton: CustomShape<'svgButton'>
  selectBox: CustomShape<'selectBox'>
  imageFollow: CustomShape<'imageFollow'>
  pointer: CustomShape<'pointer', PointerOptions>
  viewPoint: CustomShape<'viewPoint', ViewPointOptions>
  crossCircle: CustomShape<'crossCircle', CrossCircleOptions>
  basePoint: CustomShape<'basePoint', BasePointOptions>
  axis: CustomShape<'axis', AxisOptions>
  nock: CustomShape<'nock', AxisOptions>
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
  let type = typeOrEntity
  let entity = entityOrNot
  if (typeof typeOrEntity !== 'string') {
    type = typeOrEntity.type
    entity = typeOrEntity
  }

  const options = {
    strokeWidth: 1,
    hitStrokeWidth: 6,
    // @TODO 改为 false
    draggable: true,
    // shadowForStrokeEnabled: false,
    ...entity,
  }

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
  } else if (type === 'svgButton') {
    shape = new SvgButton(options)
  } else if (type === 'selectBox') {
    shape = new SelectBox(options)
  } else if (type === 'imageFollow') {
    shape = new ImageFollow(options)
  } else if (type === 'pointer') {
    shape = new Pointer(options)
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
  }
  // @todo 具体化
  // else {
  // shape = new Konva.Shape(config)
  // }

  return shape
}
