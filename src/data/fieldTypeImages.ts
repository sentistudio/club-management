import type { FieldType } from "../types/fields";

import grassImg       from "../assets/field-types/grass.svg";
import artificialImg  from "../assets/field-types/artificial.svg";
import hardImg        from "../assets/field-types/hard.svg";
import indoorPitchImg from "../assets/field-types/indoor_pitch.svg";
import smallPitchImg  from "../assets/field-types/small_pitch.svg";
import ricotenImg     from "../assets/field-types/ricoten.svg";
import hybridGrassImg from "../assets/field-types/hybrid_grass.svg";
import beachSoccerImg from "../assets/field-types/beach_soccer.svg";
import sandImg        from "../assets/field-types/sand.svg";
import concreteImg    from "../assets/field-types/concrete.svg";
import tartanImg      from "../assets/field-types/tartan.svg";
import poolImg        from "../assets/field-types/pool.svg";
import parquetImg     from "../assets/field-types/parquet.svg";
import otherImg       from "../assets/field-types/other.svg";

export const FIELD_TYPE_IMAGES: Record<FieldType, string> = {
  grass:        grassImg,
  artificial:   artificialImg,
  hard:         hardImg,
  indoor_pitch: indoorPitchImg,
  small_pitch:  smallPitchImg,
  ricoten:      ricotenImg,
  hybrid_grass: hybridGrassImg,
  beach_soccer: beachSoccerImg,
  sand:         sandImg,
  concrete:     concreteImg,
  tartan:       tartanImg,
  pool:         poolImg,
  parquet:      parquetImg,
  other:        otherImg,
};

/** Returns the image URL for a field — custom upload data URL for "other", else the SVG asset */
export const getFieldTypeImage = (f: { type: FieldType; customTypeImage?: string }): string =>
  f.type === "other" && f.customTypeImage ? f.customTypeImage : FIELD_TYPE_IMAGES[f.type];
