import { formationData } from "../data/formation_data";
import { formationSlotData } from "../data/formation_slot_data";
import {
  FORMATION_SLOT,
  BUILDER_DETACHMENT_UNIT,
  BUILDER_DETACHMENT_SLOT,
  BUILDER_FORMATION,
  BUILDER_LIST,
} from "../types";

export const listPoints = (armyList: BUILDER_LIST) => {
  const mainFactionPoints = armyList.formations
    .filter((formation) => formation.faction === armyList.main_faction)
    .map((formation2) => formationPoints(formation2))
    .reduce((acc, pts) => acc + pts, 0);

  const allyFactionPoints = armyList.formations
    .filter((formation) => formation.faction !== armyList.main_faction)
    .map((formation2) => formationPoints(formation2))
    .reduce((acc, pts) => acc + pts, 0);

  return { mainFactionPoints, allyFactionPoints };
};

export const formationPoints = (formation: BUILDER_FORMATION) => {
  const compulsorySlotPoints = formation.compulsory
    ? formation.compulsory
        .map((detachment) =>
          detachment.selected_unit
            ? detachmentPoints(detachment.selected_unit)
            : 0
        )
        .reduce((acc, pts) => acc + pts, 0)
    : 0;
  const optionalSlotPoints = formation.optional
    ? formation.optional
        .map((detachment) =>
          detachment.selected_unit
            ? detachmentPoints(detachment.selected_unit)
            : 0
        )
        .reduce((acc, pts) => acc + pts, 0)
    : 0;
  const choiceSlotPoints = formation.choice
    ? formation.choice
        .map((choice) =>
          choice.map((detachment) => {
            const dpoints = detachment.selected_unit
              ? detachmentPoints(detachment.selected_unit)
              : 0;
            return dpoints;
          })
        )
        .flat()
        .reduce((acc, pts) => acc + pts, 0)
    : 0;

  return choiceSlotPoints + compulsorySlotPoints + optionalSlotPoints;
};

export const detachmentPoints = (detachment: BUILDER_DETACHMENT_UNIT) => {
  return (
    detachment.base_cost +
    detachment.upgrade_options.reduce((acc, pts) => acc + pts.cost, 0)
  );
};

export const detachmentSize = (detachment: BUILDER_DETACHMENT_UNIT) => {
  return (
    detachment.base_size +
    detachment.upgrade_options.reduce((acc, size) => acc + size.size, 0)
  );
};

export const setBuilderDetachment = (
  formationID: number,
  formationRef: string
): BUILDER_FORMATION | null => {
  const findFormation = formationData.find(
    (formation) => formation.id === formationID
  );
  if (findFormation) {
    return {
      name: findFormation.name,
      ref_id: formationRef,
      id: formationID,
      faction: findFormation.faction,
      compulsory: getCompulsorySlots(findFormation.compulsory, formationRef),
      optional: getOptionalSlots(findFormation.optional, formationRef),
      choice: getChoiceSlots(findFormation.choice, formationRef),
    };
  }
  return null;
};

const getCompulsorySlots = (
  slotArray: number[] | null,
  formationRef: string
) => {
  if (slotArray) {
    const slots: FORMATION_SLOT[] = slotArray
      .sort()
      .map((id) => formationSlotData.find((slot) => slot.id === id))
      .filter((exists) => {
        return exists !== undefined;
      }) as FORMATION_SLOT[];
    const returnedSlots = slots.map((slot, index) => {
      return {
        ...slot,
        ref_id: formationRef,
        slot_ref: formationRef + "compulsorySlot" + index,
        selected_unit: null,
      };
    });
    return returnedSlots;
  }
  return slotArray;
};

const getOptionalSlots = (
  slotArray: number[] | null,
  formationRef: string
): BUILDER_DETACHMENT_SLOT[] | null => {
  if (slotArray && slotArray.length) {
    const slots: FORMATION_SLOT[] = slotArray
      .sort()
      .map((id) => formationSlotData.filter((slot) => slot.id === id)[0]);
    const optionalSlots = slots.map((slot, index) => {
      return {
        ...slot,
        ref_id: formationRef,
        slot_ref: formationRef + "optionalSlot" + index,
        selected_unit: null,
      };
    });
    return optionalSlots;
  }
  return null;
};

const getChoiceSlots = (
  slotArray: number[][] | null,
  formationRef: string
): BUILDER_DETACHMENT_SLOT[][] | null => {
  if (slotArray && slotArray.length) {
    // Need to get rid of this Typescript any
    const choiceArray: any = slotArray.map((secondaryArray, index) => {
      if (secondaryArray && secondaryArray.length) {
        const slots: FORMATION_SLOT[] = secondaryArray
          .sort()
          .map((id) => formationSlotData.filter((slot) => slot.id === id)[0]);

        const choiceSlots = slots.map((slot, index2) => {
          return {
            ...slot,
            ref_id: formationRef,
            slot_ref: formationRef + "choice" + index + "Slot" + index2,
            selected_unit: null,
          };
        });
        return choiceSlots;
      }
    });
    return choiceArray;
  }
  return null;
};
