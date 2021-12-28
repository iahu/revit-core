import { DoorOptions } from '@shapes/door'
import { EditableText } from './editable-text'
import Konva from 'konva'
import { Bricks, BricksConfig } from './bricks'
import { Door } from './door'
import { Elevation, ElevationOptions } from './elevation'
import { Flag, FlagOptions } from './flag'
import { FlagLabel, FlagLabelOptions } from './flag-label'
import { FloorLevels } from './floor-levels'
import { ImageFollow } from './image-follow'
import Kroup from './kroup'
import { Level, LevelOptions } from './level'
import { SelectBox } from './select-box'
import { SvgButton } from './svg-button'

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
  | 'imageFollow'

// build-in shapes
export interface BaseEntity extends Konva.ShapeConfig {
  id: string
  type: EntityType
}

export interface SvgPathEntity extends BaseEntity, Konva.PathConfig {
  id: string
  type: 'svgPath'
  data: string
}

export interface ImgUrlEntity extends BaseEntity, Omit<Konva.ImageConfig, 'image'> {
  id: string
  type: 'imgUrl'
  imgUrl: string
}
export interface EditableTextEntity extends BaseEntity, Konva.TextConfig {
  id: string
  type: 'editableText'
  text: string
}
export interface ImgEntity extends BaseEntity, Konva.ImageConfig {
  id: string
  type: 'img'
  image: CanvasImageSource | undefined
}

export interface TextEntity extends BaseEntity, Konva.TextConfig {
  id: string
  type: 'text'
  text: string
}

export interface LineEntity extends BaseEntity, Konva.LineConfig {
  id: string
  type: 'line'
}

export interface RectEntity extends BaseEntity, Konva.ShapeConfig {
  id: string
  type: 'rect'
}

// custom shapes
export interface DoorEntity extends BaseEntity, DoorOptions {
  id: string
  type: 'door'
}

export interface BricksEntity extends BaseEntity, BricksConfig {
  id: string
  type: 'bricks'
}

export interface FlagEntity extends BaseEntity, FlagOptions {
  id: string
  type: 'flag'
}

export interface FlagLabelEntity extends BaseEntity, FlagLabelOptions {
  id: string
  type: 'flagLabel'
}

export interface LevelEntity extends BaseEntity, LevelOptions {
  id: string
  type: 'level'
}

export interface ElevationEntity extends BaseEntity, ElevationOptions {
  id: string
  type: 'elevation'
}

export interface FloorLevelsEntity extends BaseEntity, ElevationOptions {
  id: string
  type: 'floorLevels'
}

export interface SvgButtonEntity extends BaseEntity, Konva.ShapeConfig {
  id: string
  type: 'svgButton'
}

export interface SelectBoxEntity extends BaseEntity, Konva.ShapeConfig {
  id: string
  type: 'selectBox'
}

export interface ImageFollowEntity extends BaseEntity, Konva.ShapeConfig {
  id: string
  type: 'imageFollow'
}

export type Entity =
  | SvgPathEntity
  | ImgUrlEntity
  | ImgEntity
  | TextEntity
  | LineEntity
  | RectEntity
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
    // fillAfterStrokeEnabled: true,
    shadowForStrokeEnabled: false,
    draggable: true,
    ...entity,
  }

  let shape: MaybeShapeOrKroup
  if (type === 'imgUrl') {
    const image = new Image()
    image.src = entity?.imgUrl
    shape = new Konva.Image({ image })
    shape.setAttrs(config)
  } else if (type === 'editableText') {
    shape = new EditableText()
    shape.setAttrs(config)
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
  } else {
    // @todo 具体化
    // shape = new Konva.Shape(config)
  }

  return shape
}
