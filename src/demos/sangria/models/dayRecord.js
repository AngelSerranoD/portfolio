/**
 * DayRecord - modelo de datos para un día
 * Persistido como JSON en localStorage['sangria_records'][dateStr]
 */

export function createDayRecord(dateStr) {
  return {
    date: dateStr,
    pillTaken: false,
    hasMenstruation: false,
    menstruationDetail: null,
    relationshipDetail: null,
  };
}

/**
 * MenstruationDetail shape:
 * {
 *   flow: "poca" | "normal" | "mucha",
 *   texture: null | "acuosa" | "claraDeHuevo" | "yema" | "espesa",
 *   pains: string[],
 *   physicalState: null | "hinchada" | "normal" | "delgada" | "cansada" | "energica",
 *   notes: null | string
 * }
 *
 * RelationshipDetail shape:
 * {
 *   withProtection: boolean,
 *   internalEjaculation: boolean,
 *   morningAfterPill: boolean,
 *   oralSex: boolean,
 *   notes: null | string
 * }
 */
