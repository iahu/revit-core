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
import Kroup from './kroup'
import { Level, LevelOptions } from './level'
import { SelectBox } from './select-box'
import { SvgButton } from './svg-button'
import { Pointer, PointerOptions } from './pointer'
import { BasePoint, BasePointOptions } from './base-point'
import Ruler, { RulerConfig } from './ruler'

export type Position = [number, number]

export type EntityType =
  | 'svgPath'
  | 'imgUrl'
  | 'editableText'
  | 'img'
  | 'text'
  | 'line'
  | 'rect'
  | 'door'
  | 'svgButton'
  | 'selectBox'
  | 'bricks'
  | 'level'
  | 'floorLevels'
  | 'flag'
  | 'flagLabel'
  | 'elevation'
  | 'ruler'
  | 'imageFollow'
  | 'pointer'
  | 'basePoint'

// build-in shapes
export interface BaseEntity extends Konva.ShapeConfig {
  id?: string
  type: EntityType
}

type CustomShape<Type extends EntityType, Inherit extends Konva.ShapeConfig = Konva.ShapeConfig> = BaseEntity &
  Inherit & {
    type: Type
  }

export type SvgPathEntity = CustomShape<'svgPath'>
export type ImgUrlEntity = CustomShape<'imgUrl', Omit<Konva.ImageConfig, 'image'> & { imgUrl: string }>
export type ImgEntity = CustomShape<'img', Konva.ImageConfig & { image?: CanvasImageSource }>
export type TextEntity = CustomShape<'text', Konva.TextConfig>
export type LineEntity = CustomShape<'line', Konva.LineConfig>
export type RectEntity = CustomShape<'rect', Konva.RectConfig>

// custom shapes
export type EditableTextEntity = CustomShape<'editableText', Konva.TextConfig & EditableTextOptions>
export type DoorEntity = CustomShape<'door', DoorOptions>
export type BricksEntity = CustomShape<'bricks', BricksConfig>
export type FlagEntity = CustomShape<'flag', FlagOptions>
export type FlagLabelEntity = CustomShape<'flagLabel', FlagLabelOptions>
export type LevelEntity = CustomShape<'level', LevelOptions>
export type ElevationEntity = CustomShape<'elevation', ElevationOptions>
export type FloorLevelsEntity = CustomShape<'floorLevels', FloorLevelsOptions>
export type RulerEntity = CustomShape<'ruler', RulerConfig>
export type SvgButtonEntity = CustomShape<'svgButton'>
export type SelectBoxEntity = CustomShape<'selectBox'>
export type ImageFollowEntity = CustomShape<'imageFollow'>
export type PointerEntity = CustomShape<'pointer', PointerOptions>
export type BasePointEntity = CustomShape<'basePoint', BasePointOptions>

export type Entity =
  | SvgPathEntity
  | ImgUrlEntity
  | ImgEntity
  | TextEntity
  | LineEntity
  | RectEntity
  | EditableTextEntity
  | DoorEntity
  | FlagEntity
  | FlagLabelEntity
  | LevelEntity
  | ElevationEntity
  | FloorLevelsEntity
  | BricksEntity
  | SvgButtonEntity
  | SelectBoxEntity
  | ImageFollowEntity
  | PointerEntity
  | BasePointEntity
  | RulerEntity

export interface Layer extends Konva.LayerConfig {
  id: string
  name?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundPosition?: Position
  entities: Array<Entity>
}

export type MaybeShapeOrKroup = Konva.Shape | Kroup | undefined

/**
 * 创建图形的工厂函数
 */
export function createShape(entity: Entity): MaybeShapeOrKroup
export function createShape(type: EntityType, entity?: Partial<Entity>): MaybeShapeOrKroup
export function createShape(typeOrEntity: EntityType | Entity, entityOrNot?: Partial<Entity>): MaybeShapeOrKroup {
  let type = typeOrEntity
  let entity = entityOrNot
  if (typeof typeOrEntity !== 'string') {
    type = typeOrEntity.type
    entity = typeOrEntity
  }

  const config = {
    // @TODO 改为 false
    draggable: true,
    shadowForStrokeEnabled: false,
    ...entity,
  }

  let shape: MaybeShapeOrKroup
  if (type === 'imgUrl') {
    const image = new Image()
    image.src = entity?.imgUrl
    shape = new Konva.Image({ image })
    shape.setAttrs(config)
  } else if (type === 'editableText') {
    shape = new EditableText(config)
  } else if (type === 'img') {
    shape = new Konva.Image({ ...config, image: entity?.image })
  } else if (type === 'svgPath') {
    shape = new Konva.Path(config)
  } else if (type === 'text') {
    shape = new Konva.Text(config)
  } else if (type === 'line') {
    shape = new Konva.Line(config)
  } else if (type === 'rect') {
    shape = new Konva.Rect(config)
  } else if (type === 'door') {
    shape = new Door(config)
  } else if (type === 'bricks') {
    shape = new Bricks(config)
  } else if (type === 'flag') {
    shape = new Flag(config)
  } else if (type === 'flagLabel') {
    shape = new FlagLabel(config)
  } else if (type === 'level') {
    shape = new Level(config)
  } else if (type === 'elevation') {
    shape = new Elevation(config)
  } else if (type === 'floorLevels') {
    shape = new FloorLevels(config)
  } else if (type === 'svgButton') {
    shape = new SvgButton(config)
  } else if (type === 'selectBox') {
    shape = new SelectBox(config)
  } else if (type === 'imageFollow') {
    shape = new ImageFollow(config)
  } else if (type === 'pointer') {
    shape = new Pointer(config)
  } else if (type === 'basePoint') {
    shape = new BasePoint(config)
  } else if (type === 'ruler') {
    shape = new Ruler(config)
  } else {
    // @todo 具体化
    // shape = new Konva.Shape(config)
  }

  return shape
}
